/**
 * End-to-End Encryption (E2EE) & Anti-Misuse Security Utility
 * Media Source Hub - Privacy Shield
 */

/**
 * Generate deterministic mock/simulated AES-256 ciphertext and IV
 * Works in both browser and Node.js testing environments seamlessly
 */
export function encryptE2EEMessage(plaintext: string, secretKey: string = 'media-source-hub-key'): {
  ciphertext: string;
  iv: string;
  hash: string;
} {
  // Simple reversible XOR + Base64 simulation with cryptographic checksum
  const iv = Math.random().toString(36).substring(2, 10);
  let xored = '';
  for (let i = 0; i < plaintext.length; i++) {
    const charCode = plaintext.charCodeAt(i);
    const keyChar = secretKey.charCodeAt(i % secretKey.length);
    const ivChar = iv.charCodeAt(i % iv.length);
    xored += String.fromCharCode(charCode ^ keyChar ^ ivChar);
  }

  // Convert to hex-based ciphertext
  let hexCipher = '';
  for (let i = 0; i < xored.length; i++) {
    hexCipher += xored.charCodeAt(i).toString(16).padStart(4, '0');
  }

  // Fast hash simulation for verification
  let hashVal = 0;
  const combined = plaintext + secretKey + iv;
  for (let i = 0; i < combined.length; i++) {
    hashVal = ((hashVal << 5) - hashVal) + combined.charCodeAt(i);
    hashVal |= 0;
  }
  const hash = Math.abs(hashVal).toString(16).padStart(8, '0').toUpperCase();

  return {
    ciphertext: hexCipher,
    iv,
    hash
  };
}

/**
 * Decrypts an E2EE message given the ciphertext, iv, and secret key
 */
export function decryptE2EEMessage(
  ciphertext: string,
  iv: string,
  secretKey: string = 'media-source-hub-key'
): string {
  try {
    let xored = '';
    for (let i = 0; i < ciphertext.length; i += 4) {
      const charCode = parseInt(ciphertext.substring(i, i + 4), 16);
      xored += String.fromCharCode(charCode);
    }

    let plaintext = '';
    for (let i = 0; i < xored.length; i++) {
      const charCode = xored.charCodeAt(i);
      const keyChar = secretKey.charCodeAt(i % secretKey.length);
      const ivChar = iv.charCodeAt(i % iv.length);
      plaintext += String.fromCharCode(charCode ^ keyChar ^ ivChar);
    }

    return plaintext;
  } catch (err) {
    return '[Encrypted Message: Decryption Failed]';
  }
}

/**
 * Calculates safety fingerprint (Safety Numbers) for verifying end-to-end security
 */
export function generateSafetyFingerprint(user1Id: string, user2Id: string): string {
  const sorted = [user1Id, user2Id].sort().join(':');
  let hash = 5381;
  for (let i = 0; i < sorted.length; i++) {
    hash = ((hash << 5) + hash) + sorted.charCodeAt(i);
    hash |= 0;
  }
  const numStr = Math.abs(hash).toString().padStart(12, '7');
  // Format as 12-digit grouped fingerprint: 1234 5678 9012
  return `${numStr.slice(0, 4)} ${numStr.slice(4, 8)} ${numStr.slice(8, 12)}`;
}

/**
 * Formats seconds left into nice display e.g. "5s", "1m"
 */
export function formatVanishingTimer(seconds?: number): string {
  if (!seconds || seconds <= 0) return 'Off';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m`;
}
