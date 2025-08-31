import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/createsession";
export async function  POST(req:NextRequest) {
    const formdata  = await req.formData()
    const email = formdata.get("email") as string
    const otp = formdata.get("otp") as string
    const session = await getSession()
    if(!email) return 

    // check user exist or not

    // check otp validaton
     if (!session.email || !session.otp) {
     return NextResponse.json({success:false,msg:"wrong otp",userexist:false})
   }
    if (session.email === email && session.otp === otp) {
        console.log("inside signin.....")
        console.log(session.email,session.otp)
       session.destroy();
       return NextResponse.json({success:true,msg:"succesfully load in",userexist:true})

    }
    
    return NextResponse.json({success:false,msg:"wrong otp",userexist:false})
}