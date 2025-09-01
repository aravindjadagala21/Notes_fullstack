"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
type NoteData = { id: number; title: string; content: string };

export default function NotePage() {
  const params = useParams();
  const id = params.id as string | undefined;

  // Local state for content (editable)
  const [content, setContent] = useState<string>("");
  const [title,setTitle] = useState<string>("")
  const [err,setErr] = useState("")
  const router = useRouter()
  async function handleSave(){
    if(!title){
         setErr("title is required")
         return 
    }
    setErr("")
    const res = await fetch(`/api/notes`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({title,content})
    })
    const data = await res.json()
    if(data.success){
      router.push("/")
    }
    if (!res.ok) {
    throw new Error("Failed to update note");
}
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between">
            <div>
            <input type="text" 
            onChange={e=>setTitle(e.target.value)}
            value={title}
            className="text-2xl font-bold mb-4" placeholder="Title" required/>
            {err && <p className="text-sm p-1 text-orange-500">{err}</p>}
            </div>
            <button 
            onClick={handleSave}
            className="text-2xl font-bold mb-4 border border-amber-200 p-1 px-3 rounded">save</button>
        </div>
        
        

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-4 bg-gray-50 min-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write or edit your note here..."
        />
      </div>
    </>
  );
}
