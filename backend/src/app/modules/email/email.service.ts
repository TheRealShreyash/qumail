import db from "../../../db";
import { account, user } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

async function refreshGoogleAccessToken(refreshToken: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to refresh Google access token: ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function getValidAccessToken(senderEmail: string) {
  const users = await db.select().from(user);
  const foundUser = users.find((u) => u.email.toLowerCase() === senderEmail.toLowerCase());

  if (!foundUser) {
    throw new Error(`No user found in database for email: ${senderEmail}. Please sign in with Google.`);
  }

  const accounts = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, foundUser.id), eq(account.providerId, "google")));

  const foundAccount = accounts[0];

  if (!foundAccount) {
    throw new Error(`No Google OAuth account linked for user ${senderEmail}. Please log in with Google.`);
  }

  let accessToken = foundAccount.accessToken;
  const refreshToken = foundAccount.refreshToken;

  if (!accessToken && !refreshToken) {
    throw new Error(
      "Google OAuth access token missing. Please sign out and sign in again with Google to grant Gmail permissions."
    );
  }

  // Try a quick validation ping
  if (accessToken) {
    const testRes = await fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + accessToken);
    if (!testRes.ok && refreshToken) {
      accessToken = await refreshGoogleAccessToken(refreshToken);
      await db.update(account).set({ accessToken }).where(eq(account.id, foundAccount.id));
    }
  } else if (refreshToken) {
    accessToken = await refreshGoogleAccessToken(refreshToken);
    await db.update(account).set({ accessToken }).where(eq(account.id, foundAccount.id));
  }

  return { accessToken: accessToken!, foundAccount };
}

export async function sendEmailViaGmail({
  senderEmail,
  recipientEmail,
  subject,
  body,
  level = "QAES-Kyber1024",
  keyId,
}: {
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  body: string;
  level?: string;
  keyId?: string;
}) {
  const { accessToken } = await getValidAccessToken(senderEmail);

  const mimeLines = [
    `From: ${senderEmail}`,
    `To: ${recipientEmail}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    `X-QuMail-Security: ${level}`,
    ...(keyId ? [`X-QuMail-Key-ID: ${keyId}`] : []),
    "",
    body,
  ];
  const mimeMessage = mimeLines.join("\r\n");

  const base64UrlMessage = Buffer.from(mimeMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: base64UrlMessage }),
  });

  if (!gmailRes.ok) {
    const errText = await gmailRes.text();
    console.error("Gmail API Send Error:", errText);
    throw new Error(`Gmail API error (${gmailRes.status}): ${errText}`);
  }

  const result = await gmailRes.json();
  return { success: true, method: "GMAIL_API", messageId: result.id, threadId: result.threadId };
}

export async function fetchInboxEmails(userEmail: string, folder: string = "inbox", maxResults: number = 20) {
  const { accessToken } = await getValidAccessToken(userEmail);

  // Map folder names to Gmail label IDs
  const labelMap: Record<string, string> = {
    inbox: "INBOX",
    sent: "SENT",
    drafts: "DRAFT",
    trash: "TRASH",
  };
  const labelId = labelMap[folder] || "INBOX";

  // 1. List message IDs
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=${labelId}&maxResults=${maxResults}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!listRes.ok) {
    const errText = await listRes.text();
    throw new Error(`Failed to fetch Gmail ${folder}: ${errText}`);
  }

  const listData = await listRes.json();
  const messages = listData.messages || [];

  if (messages.length === 0) return [];

  // 2. Batch fetch message details in parallel
  const detailed = await Promise.all(
    messages.map(async (msg: { id: string }) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=X-QuMail-Key-ID&metadataHeaders=X-QuMail-Security`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!msgRes.ok) return null;
      return msgRes.json();
    })
  );

  // 3. Normalize to frontend email shape
  return detailed
    .filter(Boolean)
    .map((msg: any) => {
      const headers: { name: string; value: string }[] = msg.payload?.headers || [];
      const getHeader = (name: string) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

      const from = getHeader("From");
      const senderName = from.replace(/<[^>]+>/, "").trim() || from.split("@")[0];
      const senderEmail = from.match(/<([^>]+)>/)?.[1] || from;

      const date = getHeader("Date");
      const parsedDate = date ? new Date(date) : new Date();
      const keyId = getHeader("X-QuMail-Key-ID");
      const security = keyId ? "QAES" : getHeader("X-QuMail-Security") || "NONE";
      const isRead = !msg.labelIds?.includes("UNREAD");

      return {
        id: msg.id,
        sender: senderName,
        senderEmail,
        subject: getHeader("Subject") || "(no subject)",
        preview: msg.snippet || "",
        body: msg.snippet || "",
        date: parsedDate.toLocaleDateString(),
        time: parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: isRead,
        starred: msg.labelIds?.includes("STARRED") || false,
        security,
        keyId: keyId || undefined,
        attachments: [],
        threadId: msg.threadId,
      };
    });
}
