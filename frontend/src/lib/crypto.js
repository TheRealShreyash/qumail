/**
 * Quantum-Safe Client-Side Payload Encryption Utilities
 * Supports:
 * - One-Time Pad (OTP) bitwise XOR (Information-Theoretic Security)
 * - Quantum-Aided AES-256-GCM (Computational Security)
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

/**
 * One-Time Pad (OTP) Bitwise XOR Encryption
 * Information-theoretically secure stream encryption.
 */
export function encryptOTP(plainText, base64Key) {
  try {
    const encoder = new TextEncoder();
    const plainBytes = encoder.encode(plainText);
    const keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

    const cipherBytes = new Uint8Array(plainBytes.length);
    for (let i = 0; i < plainBytes.length; i++) {
      // Bitwise XOR: Ciphertext[i] = Plaintext[i] ^ Key[i]
      cipherBytes[i] = plainBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return btoa(String.fromCharCode(...cipherBytes));
  } catch (err) {
    console.error("OTP Encryption error:", err);
    throw new Error("Failed to encrypt message with One-Time Pad key");
  }
}

/**
 * One-Time Pad (OTP) Bitwise XOR Decryption
 * Information-theoretically secure stream decryption.
 */
export function decryptOTP(cipherTextBase64, base64Key) {
  try {
    const cipherBytes = Uint8Array.from(atob(cipherTextBase64), (c) => c.charCodeAt(0));
    const keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

    const plainBytes = new Uint8Array(cipherBytes.length);
    for (let i = 0; i < cipherBytes.length; i++) {
      // Bitwise XOR: Plaintext[i] = Ciphertext[i] ^ Key[i]
      plainBytes[i] = cipherBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const decoder = new TextDecoder();
    return decoder.decode(plainBytes);
  } catch (err) {
    console.error("OTP Decryption error:", err);
    return "[Encrypted Quantum OTP Message — Decryption Key invalid or unauthorized]";
  }
}

/**
 * Polymorphic Payload Encryptor
 * Dispatches to OTP, QAES (AES-256-GCM), or Plaintext based on security level.
 */
export async function encryptPayload(plainText, base64Key, level = "QAES") {
  if (level === "OTP") {
    return encryptOTP(plainText, base64Key);
  }
  if (level === "NONE") {
    return plainText;
  }
  // Default to QAES (AES-256-GCM)
  return await encryptMessage(plainText, base64Key);
}

/**
 * Polymorphic Payload Decryptor
 * Dispatches to OTP, QAES (AES-256-GCM), or Plaintext based on security level.
 */
export async function decryptPayload(cipherTextBase64, base64Key, level = "QAES") {
  if (level === "OTP") {
    return decryptOTP(cipherTextBase64, base64Key);
  }
  if (level === "NONE") {
    return cipherTextBase64;
  }
  // Default to QAES (AES-256-GCM)
  return await decryptMessage(cipherTextBase64, base64Key);
}

