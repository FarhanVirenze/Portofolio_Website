import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const SECRET: string = SESSION_SECRET;
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

interface SessionPayload {
  email: string;
  iat: number;
  exp: number;
  nonce: string;
}

function hmacSign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function createSessionToken(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    email,
    iat: now,
    exp: now + SESSION_MAX_AGE,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const payloadStr = JSON.stringify(payload);
  const encodedPayload = Buffer.from(payloadStr).toString("base64url");
  const signature = hmacSign(encodedPayload, SECRET);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };

    const [encodedPayload, signature] = parts;
    const expectedSignature = hmacSign(encodedPayload, SECRET);

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: false };
    }

    const payloadStr = Buffer.from(encodedPayload, "base64url").toString();
    const payload: SessionPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return { valid: false };

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export { SESSION_MAX_AGE };
