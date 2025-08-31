import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer'
import { getSession } from "@/lib/createsession";


function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export  async function POST(req:NextRequest){
    try{
        const {email} = await req.json()
        const session = await getSession()
        
        console.log(email)

        

        if(!email){
            return NextResponse.json({
            success:false,
            message:"Email is required"
            })
        }


        
        const otp = generateOtp(6)
        console.log(otp)
        console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS)
        const transporter = nodemailer.createTransport({
            service : "gmail",
            auth:{
                user:  process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS 
            }
        })

        await transporter.sendMail({
            from: `"Auth System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p>`,
        })

        // store otp here
        session.email = email
        session.otp = otp
        await session.save()
        console.log('sisson create...',email,otp)

        return NextResponse.json({ success: true, message: "OTP sent successfully" });
        } catch (error: any) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
    }
}