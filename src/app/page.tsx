"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Trash2 } from "lucide-react";
type Note = { _id: string; title: string };

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userdata,setUserdata] = useState({
    username:"",
    email:""
  })
  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data.data);
      console.log(data)
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };
  async function fetchUserdetails(){
    const res = await fetch("/api/user");
    if (!res.ok) throw new Error("Failed to fetch notes");
    const data = await res.json();
    setUserdata(data.data)
  }

  useEffect(() => {
    fetchUserdetails()
    fetchNotes();
  }, []);


  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
     
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };



  if (loading) return <div>Loading notes...</div>;
  if (error) return <div>Failed to load notes.</div>;

  return (
    <>
    <div className="w-full h-screen flex justify-center items-center ">
    <div className="w-[357px] sm:w-[400px] sm:h-[500px] pt-[32px] border rounded-2xl  flex flex-col justify-start items-center gap-3">
      <Navbar />
      <div className=" flex flex-col gap-6">
        <div 
        className="
        flex flex-col  justify-center shadow-[0_1px_6px_#00000056]
        w-[343px] h-[130px] border-[#D9D9D9] border-[1px] p-[16px] rounded-[10px] gap-[10px]">
         <h1 className="text-2xl font-bold break-words">
          Welcome, {userdata.username}!
        </h1>
          <p className="text-lg">Email: {userdata.email}</p>
        </div>

           <Link
          href={"/notes"}
          className="w-full h-[52px] rounded-[10px] bg-blue text-white flex justify-center items-center"
        >
          Create Note
        </Link>
        
        <div className="flex flex-col gap-3">
          <h1 className="mt-1 text-xl font-[500]">Notes</h1>
        <div className="flex flex-col  gap-[10px]">
          {notes.map((note) => (
            <div
              key={note._id}
              className="w-[343px] h-[50px] rounded-[10px] border-[#D9D9D9] border-[1px] p-[16px]  hover:bg-gray-100 
              flex justify-between items-center shadow-[0_1px_6px_#00000056] "
            >
              <Link href={`/notes/${note._id}`} className="flex-1">
                {note.title}
              </Link>
              <button
                onClick={() => handleDelete(note._id)}
                
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        </div>

       
      </div>
      </div>
      </div>
    </>
  );
}
