"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function NotePage() {

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
 
  <div className="flex h-screen items-center justify-center p-4 bg-gray-100">
   
    <div className="w-[375px] h-full pt-[34px] bg-white flex flex-col justify-start items-center shadow-lg gap-5 p-5">
        <Navbar />
      <div className="w-full flex justify-between items-center gap-2">
        <div className="flex-1">
          <input 
            type="text" 
            onChange={e => setTitle(e.target.value)}
            value={title}
            placeholder="Title" 
            required
            className="w-full text-2xl font-bold mb-2 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
        </div>
        
        <button 
          onClick={handleSave}
          className="text-lg font-semibold mb-2 border border-amber-200 p-2 rounded hover:bg-amber-50 transition"
        >
          Save
        </button>
        
      </div>
{err && <p className="text-sm self-start  text-orange-500">{err}</p>}
      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write or edit your note here..."
        className="w-full border rounded block
        scroll-none 
        h-min-[200px]
        h-[400px]
        max-h-full
         p-4 bg-gray-50 
         resize-none focus:outline-none 
         focus:ring-2 focus:ring-blue-400"
      />
      
    </div>
  </div>
</>

  );
}
