"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";

type NoteData = { id: string; title: string; content: string };

export default function NotePage() {
  const params = useParams();
  const id = params?.id; 

  const [note, setNote] = useState<NoteData | null>(null);
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setIsError(true);
      return;
    }

    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (!res.ok) throw new Error("Failed to fetch note");
        const data = await res.json();

        if (!data?.data) throw new Error("Note not found");

        setNote(data.data);
        setContent(data.data.content);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);


  const handleSave = async () => {
    if (!note || !id) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: note.title, content }),
      });
      if (!res.ok) throw new Error("Failed to update note");

   
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  };

  if (isLoading) return <div>Loading note...</div>;
  if (isError || !note) return <div>Error loading note</div>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
          <button
            onClick={handleSave}
            className="text-2xl font-bold mb-4 border border-amber-200 p-1 px-3 rounded"
          >
            Save
          </button>
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
