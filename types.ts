// src/types.ts
export type Game = {
  id: number;
  name: string;
  cover?: {
    url?: string;
    id: number;
  } | null;
  genres: {
    name: string;
  }[];
};

export type HomePageProps = {
  games: Game[];
};
