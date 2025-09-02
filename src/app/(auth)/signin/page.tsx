"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RightColumn from "@/components/right-column";
import Img from "@/components/image";
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepmeloggedin,setKeepmeloggedin] = useState(false)
  const [otpsend,setOtpsend] = useState(false)
  const router = useRouter();
  const [resend,setResend] = useState(false)
  const [desablefor5sec,setDesablefor5sec] = useState(false)
  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    setDesablefor5sec(true)
    setError("");
    try {
        const res = await fetch("/api/GenerateOtp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email,signin:true }),
        });
        const data = await res.json();
        if(data.success){
          setOtpsend(data.success)
          setResend(data.success)
        }
      if (data?.msg) {
        alert(data.msg);
      }
    } catch (err:unknown) {
      setError(`Failed to send OTP : ${err}`);
    } finally {
      setLoading(false);
      setTimeout(()=>{
        setDesablefor5sec(false)
      },5000)
    }
  };

  const handleSignIn = async () => {
    if (!otp) {
      setError("Enter OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formdata = new FormData();
      formdata.set("email", email);
      formdata.set("otp", otp);
      formdata.set("keepmeloggedin",keepmeloggedin.toString()) 
      const res = await fetch("/api/signin", {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();
      alert("Signed in successfully!");
      if (data.success) {
        router.push("/");
      } else {
        throw new Error("Invalid error");
      }
    } catch (err:unknown) {
      setError(`Invalid OTP: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center 
    gap-3
    justify-center p-4">

      <div className="h-full lg:rounded-2xl flex items-center
      gap-3
       justify-center lg:border  lg:p-4">


      <div className="w-[375px] h-full 
      pt-[34px] bg-white flex flex-col justify-center items-center shadow-lg gap-5 p-5">
        <div className="w-[343px] h-[32px] flex justify-center gap-2">
           <Img/>
          <h1>HD</h1>
        </div>
        <div className="flex flex-col justify-around  items-center gap-3">
        <h1 className="h-[35px] font-[700] text-[32px] text-[#232323]">
          Sign In
        </h1>
        <p className="text-ash">please login to continue to your account</p>
        </div>

      <div className=" w-[343px] flex flex-col gap-5">
      <div className="relative ">
        <label
          htmlFor="email"
          className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-blue focus:border-blue"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=" w-full border-[1.5px] border-ash rounded-[10px] px-4 py-3  text-gray-800 focus:border-blue-500 outline-none"
        />
      </div>


       
      
         
          <div className="relative">
            <input
              type="text"
              id="otp"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500  outline-none"/>
              </div>
              <div>
              <button
              disabled={desablefor5sec}
                type="button"
                onClick={handleSendOtp}
                className=" text-[14px]  font-medium text-blue hover:underline disabled:text-ash"
              >
               {!resend? "send Otp":"Resend OTP"}
              </button>
              </div>
              <div>
              <label htmlFor="checkpoint">
                <input type="checkbox"
                name="keepmeloggedin"
                id="checkpoint"
                onChange={(e)=>setKeepmeloggedin(e.target.checked)}
                 className="mr-1  inline-block" /> 
                keep me logged in
              </label>
              </div>
          
      

       
        <button
          type="button"
          onClick={handleSignIn}
          disabled={loading || !otpsend}

          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-70"
        >
          Sign In
        </button>

      
        {error && (
          <p className="mt-3 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
       Need an account ??{" "}
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Create One
          </a>
        </p>
      </div>
      </div>

      <RightColumn/>

    </div>
    </div>
  );
}
