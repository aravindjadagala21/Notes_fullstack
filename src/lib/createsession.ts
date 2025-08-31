import {getIronSession, SessionOptions,type IronSession  } from "iron-session";
import "iron-session";
import { cookies } from "next/headers";

export const sessionOptions:SessionOptions={
  password:process.env.SESSION_SECRETE as string || 'ttttfgsdfgdsftdfgfgdfgfgsfgfgdgtttt',
  cookieName:"otp-session",
  cookieOptions:{
    secure:process.env.NODE_ENV === "production"
  },
  ttl:2*24*60*60
}

export async  function getSession(): Promise<IronSession<{ email?: string; otp?: string 
}>>{
  const cookieStore = await cookies()
  // console.log(cookieStore)
  return await getIronSession(cookieStore,sessionOptions)
}

declare module "iron-session" {
  interface IronSessionData {
    email?: string;
    otp?: string;
  }
}