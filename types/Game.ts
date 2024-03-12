// Create a types folder if it doesn't exist and add this Game.ts file
export interface Game {
  id: number; // Use either string or number, but it must be consistent
  name: string;
  background_image: string;
  metacritic: number | null;
  rating: number | null;
  slug: string;
}

// Add this to your types definition, e.g., inside Game.ts or a new Types.ts file

export interface Genre {
  id: number;
  name: string;
  image_background: string; // Assuming genres have an image background property
}

