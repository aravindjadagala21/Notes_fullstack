"use server";
import validator from "validator";
import { getSession } from "@/lib/createsession";

type State = {
  success: boolean;
  errors: Record<string, string>;
  msg?:string
};

export default async function signupUser(
  prevState: State,
  formData: FormData
): Promise<State> {
  const username = (formData.get("username") as string) || "";
  const dob = (formData.get("dob") as string) || "";
  const email = (formData.get("email") as string) || "";
  const otp = (formData.get("otp") as string) || "";
  const session = await getSession()
  const errors: Record<string, string> = {};
  let msg = ""

  if (!validator.isLength(username, { min: 3 })) {
    errors.username = "Username must be at least 3 characters long";
  }

  if (!dob || !validator.isDate(dob)) {
    errors.dob = "Invalid date of birth";
  }

  if (!validator.isEmail(email)) {
    errors.email = "Invalid email address";
  }

  //verify user already existed or not

  console.log("inside singup function otp",otp)
  //verify otp
   if (!session.email || !session.otp) {
    errors.otp = "wrong otp"
   }
   

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
   if (session.email === email && session.otp === otp) {
       session.destroy();
       return { success: true, errors: {} ,msg:"otp validation sucess"};
    }

  return { success: false, errors };
}
