"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { createNote, updateNote, getNote, summarizeText } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Sparkles } from "lucide-react";

interface NoteFormProps {
  id?: string;
}

export default function NoteForm({ id }: NoteFormProps) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [hasSummary, setHasSummary] = useState(false);
  const [unsavedSummary, setUnsavedSummary] = useState("");
  const [loading, setLoading] = useState({
    save: false,
    summarize: false,
    saveSummary: false,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [showSummaryLoading, setShowSummaryLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (isEdit && id && userId) {
      getNote(id)
        .then((note) => {
          setTitle(note.title);
          setContent(note.content);
          setSummary(note.summary || "");
          setHasSummary(!!note.summary);
        })
        .catch(() => {
          toast.error("Failed to load note.");
        });
    }
  }, [id, isEdit, userId]);

  const handleGoBack = () => router.push("/dashboard");

  const handleSummarize = async () => {
    if (!content.trim()) return toast.error("Add content first.");
    setLoading((s) => ({ ...s, summarize: true }));
    setShowSummaryLoading(true);
    try {
      const trimmed = content.slice(0, 5000);
      // Simulate loading for animation
      await new Promise((res) => setTimeout(res, 900));
      const result = await summarizeText(trimmed);
      setUnsavedSummary(result);
      toast.success("Summary draft created");
    } catch {
      toast.error("Error generating summary.");
    } finally {
      setLoading((s) => ({ ...s, summarize: false }));
      setTimeout(() => setShowSummaryLoading(false), 300); // Let animation finish
    }
  };

  // Save only title and content
  const handleSaveContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim())
      return toast.error("Title and content required.");
    if (!userId) return toast.error("Login required.");

    setLoading((s) => ({ ...s, save: true }));
    try {
      const noteData = {
        title,
        content,
        summary: hasSummary ? summary : undefined, // Keep existing summary if present
      };

      if (isEdit && id) {
        await updateNote(id, noteData);
      } else {
        await createNote({
          user_id: userId,
          ...noteData,
        });
      }
      toast.success("Note saved");
    } catch {
      toast.error("Save failed.");
    } finally {
      setLoading((s) => ({ ...s, save: false }));
    }
  };

  // Save only the summary
  const handleSaveSummary = async () => {
    if (!unsavedSummary.trim()) return toast.error("No summary to save");

    setLoading((s) => ({ ...s, saveSummary: true }));
    try {
      const noteData = {
        title,
        content,
        summary: unsavedSummary,
      };

      if (isEdit && id) {
        await updateNote(id, noteData);
        setSummary(unsavedSummary);
        setHasSummary(true);
        setUnsavedSummary("");
        toast.success("Summary saved");
      } else if (userId) {
        const newNote = await createNote({
          user_id: userId,
          ...noteData,
        });
        setSummary(unsavedSummary);
        setHasSummary(true);
        setUnsavedSummary("");
        router.push(`/dashboard/notes/${newNote.id}`);
      }
    } catch {
      toast.error("Failed to save summary");
    } finally {
      setLoading((s) => ({ ...s, saveSummary: false }));
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-black">
      {/* Left: Content Editor */}
      <div className="w-[60%] flex flex-col px-16 py-12 relative bg-black text-white">
        <button
          onClick={handleGoBack}
          className="absolute top-8 left-8 text-gray-400 hover:text-indigo-400 transition"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="bg-transparent text-5xl font-extrabold mb-4 mt-4 placeholder-gray-500 w-full focus:outline-none border-none"
        />

        {/* Save Note Button at the top */}
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            onClick={handleSaveContent}
            disabled={loading.save}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading.save ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <Save className="h-5 w-5" /> Save Note
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleSaveContent} className="flex-1 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="bg-transparent resize-none text-lg placeholder-gray-400 flex-1 w-full focus:outline-none border-none leading-relaxed"
            style={{ minHeight: "300px" }}
          />
        </form>
      </div>

      {/* Right: Summary Panel */}
      <div className="w-[40%] flex flex-col px-16 py-12 bg-[#18181b] border-l border-gray-900">
        <h2 className="text-3xl font-bold text-white mb-8">AI Summary</h2>

        <div className="flex-1 min-h-[220px] mb-8 flex items-center justify-center">
          {showSummaryLoading || loading.summarize ? (
            <div className="flex flex-col items-center justify-center h-full animate-pulse">
              <Loader2 className="h-10 w-10 text-indigo-400 mb-4 animate-spin" />
              <span className="text-indigo-300 text-lg">Generating summary...</span>
            </div>
          ) : unsavedSummary ? (
            <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-line animate-fade-in">
              {unsavedSummary}
            </div>
          ) : summary ? (
            <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-line animate-fade-in">
              {summary}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <Sparkles className="h-8 w-8 mb-2" />
              <span className="text-lg">Generate or load a summary</span>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {unsavedSummary ? (
            <>
              <Button
                size="lg"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={handleSaveSummary}
                disabled={loading.saveSummary}
              >
                {loading.saveSummary ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Save Summary"
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-indigo-600 text-indigo-400 hover:bg-indigo-600/10"
                onClick={() => setUnsavedSummary("")}
              >
                Discard
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={handleSummarize}
              disabled={loading.summarize || !content.trim()}
            >
              {loading.summarize ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Generate Summary"
              )}
            </Button>
          )}
        </div>
      </div>
      {/* Animation for fade-in */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}