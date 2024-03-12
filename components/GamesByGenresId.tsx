import React from "react";
import { useRouter } from "next/router";
import { Game } from "../types/Game";
import Image from "next/image";

interface GamesByGenresIdProps {
  gameList?: Game[];
  shouldRender?: boolean;
}

const GamesByGenresId: React.FC<GamesByGenresIdProps> = ({
  gameList = [],
  shouldRender = false,
}) => {
  const router = useRouter();

  const navigateToGame = (slug: string) => {
    router.push(`/game/${encodeURIComponent(slug)}`);
  };

  // Function to determine metacritic score color
  const getMetacriticClass = (score: number | null) => {
    if (score === null || score === undefined) {
      return "bg-gray-200 text-gray-600";
    } else if (score < 50) {
      return "bg-red-200 text-red-700";
    } else if (score >= 50 && score <= 69) {
      return "bg-yellow-200 text-yellow-700";
    } else {
      return "bg-green-200 text-green-700";
    }
  };

  if (!shouldRender) {
    return null;
  }

  const placeholderImage = "/no_image.jpg";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {gameList.map((item) => (
        <div
          key={item.id}
          className="bg-[#76a8f75e] p-3 rounded-lg h-full hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer"
          onClick={() => navigateToGame(item.slug)}
        >
          <div className="relative w-full h-80 rounded-xl overflow-hidden mb-4">
            <Image
              src={item.background_image || placeholderImage}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>

          <h3 className="text-lg font-bold text-white">
            {item.name}
            <span
              className={`p-1 rounded-sm ml-2 text-[12px] ${getMetacriticClass(
                item.metacritic
              )} font-medium`}
            >
              {item.metacritic !== null && item.metacritic !== undefined
                ? item.metacritic
                : "N/A"}
            </span>
          </h3>
          <p className="font-bold">⭐️{item.rating ? item.rating : "N/A"}</p>
        </div>
      ))}
    </div>
  );
};

export default GamesByGenresId;
