import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Notes from "@/models/Notes";
import { getUserIdFromToken } from "@/actions/getidfromtoken";


await connectDB();


export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await  context.params;; 
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const userId = await getUserIdFromToken(token);

    const note = await Notes.findOne({ _id: id, user: userId });
    if (!note) return NextResponse.json({ success: false, msg: "Note not found" });

    return NextResponse.json({ success: true, data: note });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed to fetch note", error: err });
  }
}


export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await  context.params;;  
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const userId = await getUserIdFromToken(token);
    const body = await req.json();
    const { title, content } = body;

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: id, user: userId },
      { title, content },
      { new: true }
    );

    if (!updatedNote) return NextResponse.json({ success: false, msg: "Note not found or not authorized" });

    return NextResponse.json({ success: true, data: updatedNote });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed to update note", error: err });
  }
}


export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await  context.params;; 
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const userId = await getUserIdFromToken(token);

    const deletedNote = await Notes.findOneAndDelete({ _id: id, user: userId });

    if (!deletedNote) return NextResponse.json({ success: false, msg: "Note not found or not authorized" });

    return NextResponse.json({ success: true, msg: "Note deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed to delete note", error: err });
  }
}
