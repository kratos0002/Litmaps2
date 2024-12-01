import { supabase } from "../supabaseClient";

// Fetch all books
export const fetchBooks = async () => {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }
  return data;
};

// Fetch locations for a specific book
export const fetchLocations = async (bookId) => {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("book_id", bookId);
  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
  return data;
};

// Fetch locations with descriptions for a specific book
export const fetchLocationsWithDescriptions = async (bookId) => {
  const { data, error } = await supabase
    .from("location_descriptions")
    .select(
      "description, location_id, locations (name, latitude, longitude)"
    )
    .eq("book_id", bookId);

  if (error) {
    console.error("Error fetching locations with descriptions:", error);
    return [];
  }

  return data.map((entry) => ({
    name: entry.locations.name,
    latitude: entry.locations.latitude,
    longitude: entry.locations.longitude,
    description: entry.description,
  }));
};
