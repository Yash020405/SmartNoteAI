"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import NoteForm from "@/components/notes/note-form";

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!noteId || noteId === 'new') {
        router.push('/dashboard/notes/new');
        return;
      }

      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast.error("Authentication required");
          router.push('/login');
          return;
        }

        const { data: note, error } = await supabase
          .from('notes')
          .select('id')
          .eq('id', noteId)
          .eq('user_id', session.user.id)
          .single();

        if (error || !note) {
          toast.error("Note not found or access denied");
          router.push('/dashboard');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Access verification error:", error);
        toast.error("Failed to verify note access");
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [noteId, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return <NoteForm id={noteId} />;
}