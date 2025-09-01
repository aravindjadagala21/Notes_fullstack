"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Img from "@/components/image";
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepmeloggedin,setKeepmeloggedin] = useState(false)
  const [otpsend,setOtpsend] = useState(false)
  const router = useRouter();

  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    try {
        const res = await fetch("http://localhost:3000/api/GenerateOtp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email,signin:true }),
        });
        const data = await res.json();
        if(data.success){
          setOtpsend(data.success)
        }
      if (data?.msg) {
        alert(data.msg);
      }
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
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
      const res = await fetch("http://localhost:3000/api/signin", {
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
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-[375px] pt-[34px] bg-white flex flex-col justify-center items-center gap-5 p-5">
        <div className="w-[343px] h-[32px] flex justify-center gap-2">
          {/* <img src="/top.png" alt="img" /> */}
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
                type="button"
                onClick={handleSendOtp}
                className=" text-[14px]  font-medium text-blue hover:underline"
              >
                Resend OTP
              </button>
              </div>
              <div>
              <label htmlFor="checkpoint">
                <input type="checkbox"
                name="keepmeloggedin"
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
    </div>
  );
}
