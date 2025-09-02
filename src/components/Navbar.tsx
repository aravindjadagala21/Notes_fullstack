"use client"
import { useRouter } from "next/navigation";
import Img from "./image";
import Link from "next/link";
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
      <Link href="/" className="flex items-center gap-2">
        <span className="w-[47px] h-[32px]">
          <Img/>
          </span>
        <span className="w-[129px] h-[22px]">Dashboard</span>
      </Link>

      <div className="relative">
        <button
        onClick={handleSignOut}
          className="w-[75px] h-[21px] font-[600] text-[14px] pointer">Sign Out</button>
      </div>
    </nav>
  );
}


