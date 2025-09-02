import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Notes from "@/models/Notes";
import { getUserIdFromToken } from "@/actions/getidfromtoken";

connectDB();

export async function GET(req: NextRequest) {
  console.log("inside api/notes..")
  try {
    const token: string | undefined = req.cookies.get("token")?.value;
  
    if (!token) throw new Error("Unauthorized");
    const userId = await getUserIdFromToken(token);
    const notes = await Notes.find({ user: userId });
    return NextResponse.json({ success: true, data: notes });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed to fetch notes", error: err });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token: string | undefined = req.cookies.get("token")?.value
    if (!token) throw new Error("Unauthorized");

    const userId = await getUserIdFromToken(token);
    const { title, content } = await req.json();
    if (!title || !content) {
      console.log("content is missing")
      return NextResponse.json({ success: false, msg: "Title and content are required" });
    }

    const newNote = await Notes.create({ user: userId, title, content });
    return NextResponse.json({ success: true, data: newNote });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed to create note", error: err });
  }
}