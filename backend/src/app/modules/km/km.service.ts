import { KmError, type EncKeyResult, type KmStatus } from "./km.types";

const KM_REGISTRY: Record<string, string> = {
  "alice.demo@gmail.com": process.env.KM_URL_ALICE ?? "http://localhost:4001",
  "bob.demo@gmail.com": process.env.KM_URL_BOB ?? "http://localhost:4002",
};

function resolveKmBaseUrl(email: string): string {
  const baseUrl = KM_REGISTRY[email];
  if (!baseUrl) {
    throw new KmError(
      `No KM registered for ${email} — is this a known demo account?`,
      400,
    );
  }
  return baseUrl;
}

export async function getEncryptionKey(
  userEmail: string,
): Promise<EncKeyResult> {
  const baseUrl = resolveKmBaseUrl(userEmail);
  const res = await fetch(`${baseUrl}/api/enc_keys?number=1`);

  if (res.status === 409) {
    throw new KmError(
      "Key bank exhausted — need to reseed/rendezvous KMs.",
      409,
    );
  }
  if (!res.ok) {
    throw new KmError(`KM enc_keys failed: ${res.status}`, res.status);
  }
  const body = (await res.json()) as { keys: EncKeyResult[] };
  return body.keys[0]!;
}

export async function getDecryptionKey(
  userEmail: string,
  keyId: string,
): Promise<EncKeyResult> {
  const baseUrl = resolveKmBaseUrl(userEmail);
  const res = await fetch(
    `${baseUrl}/api/dec_keys?key_ID=${encodeURIComponent(keyId)}`,
  );

  if (res.status === 404) {
    throw new KmError(
      `Key ${keyId} not found or not yet allocated on this KM.`,
      404,
    );
  }
  if (!res.ok) {
    throw new KmError(`KM dec_keys failed: ${res.status}`, res.status);
  }
  const body = (await res.json()) as { keys: EncKeyResult[] };
  return body.keys[0]!;
}

export async function getKmStatus(userEmail: string): Promise<KmStatus> {
  const baseUrl = resolveKmBaseUrl(userEmail);
  const res = await fetch(`${baseUrl}/api/status`);
  if (!res.ok) throw new KmError(`KM status failed: ${res.status}`, res.status);
  return res.json() as Promise<KmStatus>;
}
