import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "db connected.." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "db fail to connect..." }, { status: 500 });
  }
}
