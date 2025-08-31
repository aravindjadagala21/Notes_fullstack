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
  const [err, setErr] = useState<{ username?: string; email?: string;dob?:string }>({});

  async function generateOtp() {
    let hasError = false;

    if (!username || username.length < 3) {
      setErr((prev) => ({
        ...prev,
        username: "Username must be at least 3 characters long",
      }));
      hasError = true;
    }

    if (!email || !email.includes("@")) {
      setErr((prev) => ({
        ...prev,
        email: "Invalid email address",
      }));
      hasError = true;
    }
    if (!dob ) {
      setErr((prev) => ({
        ...prev,
        dob: "Enter data",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await fetch("http://localhost:3000/api/GenerateOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      console.log("OTP Response:", result);

      setErr({});
      setToggle(true);
    } catch (error) {
      console.error("OTP error:", error);
    }
  }

  if (state.success) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>

      <form action={formAction} className="flex flex-col gap-3 w-64">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          name="username"
          placeholder="Username"
          className="border p-2 rounded"
        />
        {state.errors.username && (
          <p className="text-sm text-red-500">{state.errors.username}</p>
        )}
        {err.username && <p className="text-sm text-red-500">{err.username}</p>}

        <input
          type="date"
          onChange={(e) => setDob(e.target.value)}
          value={dob}
          name="dob"
          className="border p-2 rounded"
        />
        {err.dob && <p className="text-sm text-red-500">{err.dob}</p>}
        {state.errors.dob && (
          <p className="text-sm text-red-500">{state.errors.dob}</p>
        )}

        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        {state.errors.email && (
          <p className="text-sm text-red-500">{state.errors.email}</p>
        )}
        {err.email && <p className="text-sm text-red-500">{err.email}</p>}

        {toggle && (
          <div>
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              className="border p-2 rounded"
            />
            {state.errors.otp && (
              <p className="text-sm text-red-500">{state.errors.otp}</p>
            )}
          </div>
        )}

        {toggle ? (
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign up
          </button>
        ) : (
          <button
            type="button"
            onClick={generateOtp}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Get OTP
          </button>
        )}
      </form>
    </div>
  );
}
