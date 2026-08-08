import { eq, or, count, desc } from "drizzle-orm";
import db from "../../../db";
import { quantumKeys, securityLogs } from "../../../db/schema";
import { KmError, type EncKeyResult, type KmStatus } from "./km.types";
import crypto from "node:crypto";

export async function generateEncryptionKey(
  senderEmail: string,
  recipientEmail: string,
  algorithm: string = "QAES-Kyber1024",
  ipAddress: string = "127.0.0.1"
): Promise<EncKeyResult> {
  if (!senderEmail || !recipientEmail) {
    throw new KmError("Sender and recipient email addresses are required", 400);
  }

  // Generate a random 256-bit key for AES-GCM (base64 encoded)
  const rawKeyBytes = crypto.randomBytes(32);
  const keyValue = rawKeyBytes.toString("base64");
  const key_ID = `qk_${crypto.randomBytes(8).toString("hex")}`;
  const id = crypto.randomUUID();

  // Save to database
  const [createdKey] = await db
    .insert(quantumKeys)
    .values({
      id,
      keyId: key_ID,
      keyValue,
      algorithm,
      senderEmail,
      recipientEmail,
      status: "ACTIVE",
    })
    .returning();

  // Log action
  await db.insert(securityLogs).values({
    id: crypto.randomUUID(),
    userEmail: senderEmail,
    action: "KEY_GENERATED",
    keyId: key_ID,
    algorithm,
    ipAddress,
  });

  return {
    key_ID: createdKey.keyId,
    key: createdKey.keyValue,
    algorithm: createdKey.algorithm,
    senderEmail: createdKey.senderEmail,
    recipientEmail: createdKey.recipientEmail,
    createdAt: createdKey.createdAt,
  };
}

export async function getDecryptionKey(
  userEmail: string,
  keyId: string,
  ipAddress: string = "127.0.0.1"
): Promise<EncKeyResult> {
  if (!userEmail || !keyId) {
    throw new KmError("User email and key_ID are required", 400);
  }

  const [foundKey] = await db
    .select()
    .from(quantumKeys)
    .where(eq(quantumKeys.keyId, keyId));

  if (!foundKey) {
    await db.insert(securityLogs).values({
      id: crypto.randomUUID(),
      userEmail,
      action: "UNAUTHORIZED_ACCESS_ATTEMPT",
      keyId,
      ipAddress,
    });
    throw new KmError(`Quantum key '${keyId}' not found`, 404);
  }

  // Verify access: user must be sender or recipient
  const isAuthorized =
    foundKey.senderEmail.toLowerCase() === userEmail.toLowerCase() ||
    foundKey.recipientEmail.toLowerCase() === userEmail.toLowerCase();

  if (!isAuthorized) {
    await db.insert(securityLogs).values({
      id: crypto.randomUUID(),
      userEmail,
      action: "UNAUTHORIZED_ACCESS_ATTEMPT",
      keyId,
      algorithm: foundKey.algorithm,
      ipAddress,
    });
    throw new KmError("Access denied: You are not authorized to retrieve this decryption key", 403);
  }

  // Mark as consumed & log access
  if (foundKey.status === "ACTIVE") {
    await db
      .update(quantumKeys)
      .set({ status: "CONSUMED" })
      .where(eq(quantumKeys.keyId, keyId));
  }

  await db.insert(securityLogs).values({
    id: crypto.randomUUID(),
    userEmail,
    action: "KEY_DECRYPTED",
    keyId,
    algorithm: foundKey.algorithm,
    ipAddress,
  });

  return {
    key_ID: foundKey.keyId,
    key: foundKey.keyValue,
    algorithm: foundKey.algorithm,
    senderEmail: foundKey.senderEmail,
    recipientEmail: foundKey.recipientEmail,
    createdAt: foundKey.createdAt,
  };
}

export async function getKmStatus(userEmail: string): Promise<KmStatus> {
  const allKeys = await db.select().from(quantumKeys);
  const allLogs = await db.select().from(securityLogs);

  const totalKeys = allKeys.length;
  const activeKeys = allKeys.filter((k) => k.status === "ACTIVE").length;
  const consumedKeys = allKeys.filter((k) => k.status === "CONSUMED").length;

  return {
    totalKeys,
    activeKeys,
    consumedKeys,
    totalLogs: allLogs.length,
  };
}

export async function getKeysList(userEmail?: string) {
  if (userEmail) {
    return await db
      .select()
      .from(quantumKeys)
      .where(
        or(
          eq(quantumKeys.senderEmail, userEmail),
          eq(quantumKeys.recipientEmail, userEmail)
        )
      )
      .orderBy(desc(quantumKeys.createdAt));
  }
  return await db.select().from(quantumKeys).orderBy(desc(quantumKeys.createdAt));
}

export async function getLogsList(userEmail?: string) {
  if (userEmail) {
    return await db
      .select()
      .from(securityLogs)
      .where(eq(securityLogs.userEmail, userEmail))
      .orderBy(desc(securityLogs.createdAt));
  }
  return await db.select().from(securityLogs).orderBy(desc(securityLogs.createdAt));
}
