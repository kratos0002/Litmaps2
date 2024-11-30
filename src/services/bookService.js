import { supabase } from "../supabaseClient";

// Fetch all books from the database
export const fetchBooks = async () => {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }
  return data;
};
