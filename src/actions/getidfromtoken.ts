import { jwtVerify } from "jose";

export async function getUserIdFromToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.id as string;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
