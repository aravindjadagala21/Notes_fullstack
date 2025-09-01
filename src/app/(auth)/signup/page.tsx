"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import signupUser from "@/actions/singupuser";

export default function SignupPage() {
  const [state, formAction] = useActionState(signupUser, {
    success: false,
    errors: {},
  });

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [toggle, setToggle] = useState(false);

 
  const [err, setErr] = useState<{ username?: string; email?: string; dob?: string }>({});

  async function generateOtp(e: React.MouseEvent) {
    e.preventDefault();
    let hasError = false;
    const newErr: typeof err = {};

    if (!username || username.length < 3) {
      newErr.username = "Username must be at least 3 characters long";
      hasError = true;
    }
    if (!email || !email.includes("@")) {
      newErr.email = "Invalid email address";
      hasError = true;
    }
    if (!dob) {
      newErr.dob = "Enter date of birth";
      hasError = true;
    }

    setErr(newErr);
    if (hasError) return;

    try {
      const res = await fetch("/api/GenerateOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,signin:false }),
      });
      const result = await res.json();

     if(result.msg){
       alert(result.msg)
     }

      setToggle(result.success);
      setErr({});
    } catch (error) {
      console.error("OTP generation failed:", error);
    }
  }

  if (state.success) {
    router.push("/");
  }

  return (
<div className="flex min-h-screen items-center justify-center  p-4">
  <div className="w-[375px] pt-[34px] bg-white flex flex-col justify-center items-center shadow-md gap-5 p-5">
    
    <div className="w-[343px] h-[32px] flex justify-center gap-2">
      <img src="/top.png" alt="logo" />
      <h1>HD</h1>
    </div>

   
    <div className="flex flex-col justify-around items-center gap-3">
      <h1 className="h-[35px] font-[700] text-[32px] text-[#232323]">Sign Up</h1>
      <p className="text-ash">Signup to enjoy the features of HD</p>
    </div>

  
    <form action={formAction} className="w-[343px] flex flex-col gap-5">
      
      <div className="relative">
        <label
          htmlFor="username"
          className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-blue"
        >
          Username
        </label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          name="username"
          id="username"
          placeholder="Your username"
          className="w-full border-[1.5px] border-ash rounded-[10px] px-4 py-3 text-gray-800 focus:border-blue-500 outline-none"
        />
        {state.errors.username && <p className="text-sm text-red-500">{state.errors.username}</p>}
        {err.username && <p className="text-sm text-red-500">{err.username}</p>}
      </div>

    
      <div className="relative">
        <label
          htmlFor="dob"
          className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-blue"
        >
          Date of Birth
        </label>
        <input
          type="date"
          onChange={(e) => setDob(e.target.value)}
          value={dob}
          name="dob"
          id="dob"
          className="w-full border-[1.5px] border-ash rounded-[10px] px-4 py-3 text-gray-800 focus:border-blue-500 outline-none"
        />
        {state.errors.dob && <p className="text-sm text-red-500">{state.errors.dob}</p>}
        {err.dob && <p className="text-sm text-red-500">{err.dob}</p>}
      </div>


      <div className="relative">
        <label
          htmlFor="email"
          className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-blue"
        >
          Email
        </label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          id="email"
          placeholder="you@example.com"
          className="w-full border-[1.5px] border-ash rounded-[10px] px-4 py-3 text-gray-800 focus:border-blue-500 outline-none"
        />
        {state.errors.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
        {err.email && <p className="text-sm text-red-500">{err.email}</p>}
      </div>

     
      {toggle && (
        <div className="relative">
          <label
            htmlFor="otp"
            className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-blue"
          >
            OTP
          </label>
          <input
            type="text"
            name="otp"
            id="otp"
            placeholder="Enter OTP"
            className="w-full border-[1.5px] border-ash rounded-[10px] px-4 py-3 text-gray-800 focus:border-blue-500 outline-none"
          />
          {state.errors.otp && <p className="text-sm text-red-500">{state.errors.otp}</p>}
        </div>
      )}

      
      {!toggle ? (
        <button
          type="button"
          onClick={generateOtp}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-70"
        >
          Get OTP
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={generateOtp}
            className="w-full rounded-lg bg-gray-500 px-4 py-2 text-white font-semibold shadow-md hover:bg-gray-600 transition disabled:opacity-70"
          >
            Resend OTP
          </button>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-70"
          >
            Sign Up
          </button>
        </>
      )}
    </form>

   
    <p className="text-center text-sm text-gray-600 mt-3">
      Already have an account?{" "}
      <a href="/signin" className="text-blue-600 font-medium hover:underline">
        Sign In
      </a>
    </p>
  </div>
</div>

  );
}
