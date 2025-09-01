"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const router = useRouter()
    const handleSignOut = async () => {
    try {
      const res = await fetch("/api/signout", {
        method: "POST",
      });

      const data = await res.json();
      console.log(data.message);

      if (data.success) {
        router.push("/signin")
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };



  return (
    <nav className="flex justify-between items-center p-4 ">
      <a href="/" className="flex items-center gap-2">
        <span className="w-[47px] h-[32px]"><img src="/top.png" alt="" /></span>
        <span className="w-[129px] h-[22px]">Dashboard</span>
      </a>

      <div className="relative">
        <button
        onClick={handleSignOut}
          className="w-[75px] h-[21px] font-[600] text-[14px] pointer">Sign Out</button>
      </div>
    </nav>
  );
}

function ProfileCard({ user }: { user: { name: string; dob: string } }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [dob, setDob] = useState(user.dob);

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white shadow p-3 rounded border">
      <input
        className="border p-1 w-full mb-2"
        value={name}
        disabled={!editing}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-1 w-full mb-2"
        value={dob}
        disabled={!editing}
        onChange={(e) => setDob(e.target.value)}
      />
      <button
        onClick={() => setEditing(!editing)}
        className="bg-blue-500 text-white py-1 px-3 rounded"
      >
        {editing ? "Save" : "Edit"}
      </button>
    </div>
  );
}
