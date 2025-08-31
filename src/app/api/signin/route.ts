import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/createsession";
import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const formdata = await req.formData();
  const email = formdata.get("email") as string;
  const otp = formdata.get("otp") as string;
  const session = await getSession();

  if (!email) {
    return NextResponse.json({ success: false, msg: "Email is required" });
  }

  
  await connectDB();
  const userexist = await Users.findOne({ email });
  if (!userexist) {
    return NextResponse.json({
      success: false,
      msg: "Account not found",
      userexist: false,
    });
  }

  
  if (!session.email || !session.otp) {
    return NextResponse.json({
      success: false,
      msg: "Wrong OTP",
      userexist: true,
    });
  }

  if (session.email === email && session.otp === otp) {
    console.log("inside signin.....");
    session.destroy();


    const token = jwt.sign(
      { id: userexist._id, email: userexist.email }, 
      process.env.JWT_SECRET as string,             
      { expiresIn: "7d" }                          
    );

   
    const response = NextResponse.json({
      success: true,
      msg: "Successfully logged in",
      userexist: true,
      token, 
    });

  
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  }

  return NextResponse.json({
    success: false,
    msg: "Wrong OTP",
    userexist: true,
  });
}
