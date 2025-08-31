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

  // local validation errors
  const [err, setErr] = useState<{ username?: string; email?: string; dob?: string }>({});

  async function generateOtp(e: React.MouseEvent) {
    e.preventDefault(); // ✅ prevent form submit
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
        body: JSON.stringify({ email }),
      });
      const result = await res.json();

      if (result.userexist) {
        router.push("/login");
        return;
      }

      setToggle(true);
      setErr({});
    } catch (error) {
      console.error("OTP generation failed:", error);
    }
  }

  if (state.success) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form action={formAction} className="flex flex-col gap-3 w-64">
        {/* username */}
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          name="username"
          placeholder="Username"
          className="border p-2 rounded"
        />
        {state.errors.username && <p className="text-sm text-red-500">{state.errors.username}</p>}
        {err.username && <p className="text-sm text-red-500">{err.username}</p>}

        {/* dob */}
        <input
          type="date"
          onChange={(e) => setDob(e.target.value)}
          value={dob}
          name="dob"
          className="border p-2 rounded"
        />
        {state.errors.dob && <p className="text-sm text-red-500">{state.errors.dob}</p>}
        {err.dob && <p className="text-sm text-red-500">{err.dob}</p>}

        {/* email */}
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        {state.errors.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
        {err.email && <p className="text-sm text-red-500">{err.email}</p>}

        {/* otp input */}
        {toggle && (
          <div>
            <input type="text" name="otp" placeholder="OTP" className="border p-2 rounded w-full" />
            {state.errors.otp && <p className="text-sm text-red-500">{state.errors.otp}</p>}
          </div>
        )}

        {/* buttons */}
        {!toggle ? (
          <button
            type="button"
            onClick={generateOtp}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Get OTP
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={generateOtp}
              className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Resend OTP
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign up
            </button>
          </>
        )}
      </form>
    </div>
  );
}
