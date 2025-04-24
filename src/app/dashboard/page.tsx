"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Pencil, Clock, Loader2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { getNotes, deleteNote } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(""); // For heading
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedSummaries, setExpandedSummaries] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        setUserId(data.session.user.id);

        // Set userName for heading
        const metaName = data.session.user.user_metadata?.full_name;
        if (metaName) setUserName(metaName.split(" ")[0]);
        else if (data.session.user.email) setUserName(data.session.user.email.split("@")[0]);
        else setUserName("User");
      }
    };
    checkSession();
  }, [router]);

  const {
    data: notes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notes", userId],
    queryFn: () => userId ? getNotes(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
  );

  const createNewNote = () => {
    router.push("/dashboard/notes/new");
  };

  const editNote = (id: string) => {
    router.push(`/dashboard/notes/${id}`);
  };

  const confirmDeleteNote = (id: string) => {
    setNoteIdToDelete(id);
  };

  const handleDeleteNote = async () => {
    if (!noteIdToDelete) return;
    setIsDeleting(true);
    try {
      await deleteNote(noteIdToDelete);
      toast.success("Note deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setNoteIdToDelete(null);
      setIsDeleting(false);
    }
  };

  const toggleSummary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSummaries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getNoteColor = (title: string) => {
    const colorOptions = [
      "from-blue-500 to-indigo-600",
      "from-indigo-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-pink-500 to-rose-600",
      "from-rose-500 to-red-600",
      "from-amber-500 to-orange-600",
      "from-lime-500 to-green-600",
      "from-teal-500 to-cyan-600",
    ];
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorOptions[hash % colorOptions.length];
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-6 py-6 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
            {userName ? `${userName}'s Notes` : "Notes"}
          </h1>
          <Button
            onClick={createNewNote}
            size="sm"
            className="h-9 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Note
          </Button>
        </div>
        <div className="relative max-w-lg w-full mx-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10 h-10 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load notes. Please try again.
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {search ? "No notes match your search" : "No notes yet. Create your first note!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const colorGradient = getNoteColor(note.title);
              const isSummaryExpanded = expandedSummaries[note.id] || false;
              return (
                <div
                  key={note.id}
                  className="bg-card rounded-lg border border-border/40 shadow-sm overflow-hidden flex flex-col group relative hover:shadow-md transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  onClick={() => editNote(note.id)}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${colorGradient}`} />
                  <div className="p-5 flex-1 flex flex-col gap-2">
                    <h3 className="font-bold text-xl truncate text-foreground">{note.title}</h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <Clock className="h-3 w-3" />
                      {formatDate(note.updated_at)}
                    </div>
                    {!isSummaryExpanded && (
                      <div className="text-sm line-clamp-4 text-muted-foreground/90">{note.content}</div>
                    )}
                    {note.summary && (
                      <div className={cn(
                        "mt-2 transition-all duration-300 ease-in-out",
                        isSummaryExpanded ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
                      )}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="h-4 w-4 text-indigo-400" />
                          <span className="text-xs font-medium text-indigo-500">AI Summary</span>
                        </div>
                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-md border border-indigo-100 dark:border-indigo-900/30">
                          <p className="text-sm leading-relaxed">{note.summary}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 border-t bg-muted/20">
                    {note.summary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        onClick={(e) => toggleSummary(note.id, e)}
                      >
                        {isSummaryExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Summary
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Summary
                          </>
                        )}
                      </Button>
                    )}
                    <div className="flex gap-1 ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          editNote(note.id);
                        }}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteNote(note.id);
                        }}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!noteIdToDelete} onOpenChange={(open: boolean) => !open && setNoteIdToDelete(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
