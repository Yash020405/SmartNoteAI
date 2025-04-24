import { supabase } from './supabase';
import { Note } from './supabase';

// Notes API functions
export const getNotes = async (userId: string) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
  return data as Note[];
};

export const getNote = async (id: string) => {
  console.log("API getNote called with ID:", id);
  
  if (!id) {
    console.error("Error: Note ID is required");
    throw new Error("Note ID is required");
  }
  
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error getting note:", error);
      throw error;
    }
    
    if (!data) {
      console.error("Error: Note not found for ID:", id);
      throw new Error("Note not found");
    }
    
    console.log("Note retrieved successfully:", data);
    return data as Note;
  } catch (error) {
    console.error("Exception in getNote:", error);
    throw error;
  }
};

export const createNote = async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
  console.log("API createNote called with:", note);
  
  if (!note.user_id) {
    throw new Error("User ID is required to create a note");
  }
  
  // Ensure summary is not an empty string
  const noteData = {
    ...note,
    summary: note.summary === "" ? null : note.summary
  };
  
  const { data, error } = await supabase
    .from('notes')
    .insert(noteData)
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    throw error;
  }
  
  console.log("Note created successfully:", data);
  return data as Note;
};

export const updateNote = async (id: string, note: Partial<Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
  // Ensure summary is not an empty string
  const noteData = {
    ...note,
    summary: note.summary === "" ? null : note.summary
  };
  
  const { data, error } = await supabase
    .from('notes')
    .update(noteData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating note:", error);
    throw error;
  }
  return data as Note;
};

export const deleteNote = async (id: string) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
  return true;
};

// AI Summarization API
export const summarizeText = async (text: string) => {
  try {
    console.log("Calling summarize API with text length:", text.length);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Summarize API error response:", response.status, errorData);
      throw new Error(errorData.error || `Failed to summarize text (${response.status})`);
    }

    const data = await response.json();
    
    if (!data.summary) {
      console.error("No summary returned from API");
      return "Unable to generate summary";
    }
    
    return data.summary;
  } catch (error: any) {
    console.error('Error summarizing text:', error);
    
    // Better handling for abort errors
    if (error.name === 'AbortError') {
      throw new Error('Summarization request timed out. Please try again.');
    }
    
    throw error;
  }
}; 