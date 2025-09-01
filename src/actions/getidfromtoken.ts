import { jwtVerify } from "jose";

export async function getUserIdFromToken(token: string) {
  try {
    console.log("inside the getUseridfromtoken.");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    console.log("this is the user id", payload.id);
    return payload.id as string;
  } catch (err) {
    console.log("error occurred");
    throw new Error("Invalid token");
  }
}
