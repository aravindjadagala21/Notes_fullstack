"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        body: JSON.stringify({ email }),
      });
      const data = res.json()
      console.log(data)
      setOtpSent(true); // mark OTP as sent
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Simulate sign-in verification
  const handleSignIn = async () => {
    if (!otp) {
      setError("Enter OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formdata = new FormData()
      formdata.set("email",email)
      formdata.set('otp',otp)
        const res = await fetch("http://localhost:3000/api/signin", {
        method: "POST",
        body: formdata,
      });
      const data = await res.json()
      alert("Signed in successfully!"); 
      if(data.success){
        router.push("/")
      }else{
        throw new Error("Invalid error")
      }
     
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-80 bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded mb-4 w-full focus:outline-none focus:ring focus:ring-blue-300"
        />

        <div className="relative">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
          />


          {otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="absolute left-0 top-full mt-1 text-xs text-blue-600"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Main action button */}
        <button
          type="button"
          onClick={otpSent ? handleSignIn : handleSendOtp}
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded mt-4 w-full hover:bg-blue-600 transition"
        >
          {loading ? "Processing..." : otpSent ? "Sign In" : "Send OTP"}
        </button>
         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      </div>
    </div>
  );
}
