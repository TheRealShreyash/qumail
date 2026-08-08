/**
 * Quantum-Safe Client-Side Payload Encryption Utilities (AES-256-GCM)
 */

export async function encryptMessage(plainText, base64Key) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    // Decode Base64 Key
    const binaryKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

    // Import key for AES-GCM
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      binaryKey,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    // 12-byte IV initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data
    );

    // Pack IV + Encrypted Data into Base64 payload
    const packed = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    packed.set(iv, 0);
    packed.set(new Uint8Array(encryptedBuffer), iv.length);

    return btoa(String.fromCharCode(...packed));
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("Failed to encrypt message with quantum key");
  }
}

export async function decryptMessage(cipherTextBase64, base64Key) {
  try {
    // Decode Base64 Ciphertext
    const packed = Uint8Array.from(atob(cipherTextBase64), (c) => c.charCodeAt(0));

    // Extract IV (first 12 bytes) and Encrypted Payload
    const iv = packed.slice(0, 12);
    const data = packed.slice(12);

    // Decode Base64 Key
    const binaryKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      binaryKey,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.error("Decryption error:", err);
    return "[Encrypted Quantum Message — Decryption Key invalid or unauthorized]";
  }
}
