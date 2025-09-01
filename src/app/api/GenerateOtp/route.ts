import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer'
import { getSession } from "@/lib/createsession";
import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";

function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export  async function POST(req:NextRequest){
    try{
        await connectDB()
        const {email,signin} = await req.json()
        const session = await getSession()
        console.log(email,signin)
        if(!email){
            return NextResponse.json({
            success:false,
            message:"Email is required"
            })
        }
        const user = await Users.findOne({email})
        console.log(user)

        if(!user && signin){
             return NextResponse.json({ success: false, msg: "User not exist.." });
        }
        if(user && !signin){
             return NextResponse.json({ success: false, msg: "user alredy exist...." });
        }

        const otp = generateOtp(6)
        console.log(otp)
        console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS)


 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // or 587 if you want STARTTLS
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // App Password
  },
});

        await transporter.sendMail({
            from: `"Auth System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p>`,
        })

        session.email = email
        session.otp = otp
        await session.save()
        console.log('sisson create...',email,otp)

        return NextResponse.json({ success: true, msg: "OTP sent successfully" });
        } catch (error: any) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ success: false, msg: "Failed to send OTP" }, { status: 500 });
    }
}