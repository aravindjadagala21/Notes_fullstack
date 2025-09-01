import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/actions/getidfromtoken";
import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";

export async function GET(req: NextRequest) {
  try {
 
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
    }

    
    const userId = await getUserIdFromToken(token);


    await connectDB();

 
    const user = await Users.findById(userId).select("-password"); // exclude password
    if (!user) {
      return NextResponse.json({ success: false, msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    return NextResponse.json({ success: false, msg: err.message }, { status: 500 });
  }
}
