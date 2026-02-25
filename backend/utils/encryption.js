import crypto from "crypto";

const algorithm = "aes-256-cbc";

function getKey() {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set!");
  }
  return crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();
}

export function encrypt(data) {
  const key = getKey(); // computed at call time, not import time
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), data: encrypted };
}

export function decrypt(encryptedObj) {
  const key = getKey(); // computed at call time, not import time
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encryptedObj.iv, "hex"),
  );
  let decrypted = decipher.update(encryptedObj.data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}
