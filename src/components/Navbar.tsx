"use client"
import { useState } from "react";

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);

  const user = { name: "John Doe", dob: "1990-01-01" };

  return (
    <nav className="flex justify-between items-center p-4 ">
      <a href="/" className="flex items-center gap-2">
        <span className="w-[47px] h-[32px]"><img src="/top.png" alt="" /></span>
        <span className="w-[129px] h-[22px]">Dashboard</span>
      </a>

      <div className="relative">
        <button  className="w-[75px] h-[21px] font-[600] text-[14px]">Sign Out</button>
        {/* <div
          onClick={() => setOpenProfile(!openProfile)}
          onMouseEnter={() => setOpenProfile(true)}
          onMouseLeave={() => setOpenProfile(false)}
          className="cursor-pointer"
        >
          <span className="text-2xl">👤</span>
        </div> */}
        {/* {openProfile && (
          <ProfileCard user={user} />
        )} */}
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
