"use server";
import validator from "validator";
import { getSession } from "@/lib/createsession";
import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type State = {
  success: boolean;
  errors: Record<string, string>;
  msg?: string;
  userexist?: boolean;
};

export default async function signupUser(
  prevState: State,
  formData: FormData
): Promise<State> {
  const username = (formData.get("username") as string) || "";
  const dob = (formData.get("dob") as string) || "";  // <-- keep as string
  const email = (formData.get("email") as string) || "";
  const otp = (formData.get("otp") as string) || "";
  const session = await getSession();
  const errors: Record<string, string> = {};

  
  if (!validator.isLength(username, { min: 3 }))
    errors.username = "Username must be at least 3 characters long";

  if (!dob || !validator.isDate(dob, { format: "YYYY-MM-DD", strictMode: true }))
    errors.dob = "Invalid date of birth";

  if (!validator.isEmail(email))
    errors.email = "Invalid email address";

  if (!session.email || !session.otp)
    errors.otp = "wrong otp";

  if (Object.keys(errors).length > 0)
    return { success: false, errors };

  if (session.email === email && session.otp === otp) {
    session.destroy();
    try {
      await connectDB();
      console.log(" DB connected...");

      let user = await Users.findOne({ email });
      if (!user) {
        user = await Users.create({ email, username, dob: new Date(dob) });
        console.log(" User created:", user);
      } else {

        console.log(" User already exists:", user);
         return { success: false, errors: {}, msg: "user already exist.." };
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET!
      );

      cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      console.log(" Token generated:", token);

      return {
        success: true,
        errors: {},
        msg: user ? "login success" : "signup success",
        userexist: !!user,
      };
    } catch (err) {
      console.error(" Error in signupUser:", err);
      return { success: false, errors: {}, msg: "server problem... try again" };
    }
  }

  return { success: false, errors, msg: "otp validation failed" };
}
