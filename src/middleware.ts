import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const publicPaths = ["/signin", "/signup", "/api/GenerateOtp"];

  if (token && publicPaths.some(path => req.nextUrl.pathname.includes(path))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (publicPaths.some(path => req.nextUrl.pathname.includes(path))) {
    return NextResponse.next();
  }


  if (!token) {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  try {
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    console.log("JWT payload:", payload);

    return NextResponse.next();
  } catch (err) {
    console.log("Invalid token:", err);
    return NextResponse.redirect(new URL("/signup", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
