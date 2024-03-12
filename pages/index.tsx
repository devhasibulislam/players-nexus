import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GamesByGenresId from "../components/GamesByGenresId";
import GenreList from "../components/GenreList";
import Pagination from "../components/Pagination";
import globalapi from "../services/globalapi";
import { Game } from "../types/Game";
import Image from "next/image";

interface ApiResponse {
  data: {
    results: Game[];
    count: number;
  };
}

const Home: React.FC = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  const [gameList, setGameList] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [heading, setHeading] = useState<string>("Action Games");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(4);
  const [isGenreListVisible, setIsGenreListVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    fetchGamesByPage(1); // Fetch 'Action' games initially
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isLoading
      )
        return;
      fetchMoreData();
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  const fetchGamesByPage = useCallback(
    async (page: number) => {
      try {
        let response: ApiResponse;
        setIsLoading(true);
        if (selectedGenreId !== null) {
          response = await globalapi.getGameListByGenreId(
            selectedGenreId,
            page
          );
        } else {
          response = await globalapi.searchGamesByName(searchQuery, page);
        }
        if (isMounted.current) {
          setGameList((prevGameList) => [
            ...prevGameList,
            ...response.data.results,
          ]);
          setTotalPages(Math.ceil(response.data.count / 20));
          setCurrentPage(page);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        setIsLoading(false);
      }
    },
    [selectedGenreId, searchQuery]
  );

  const fetchMoreData = () => {
    if (currentPage < totalPages) {
      fetchGamesByPage(currentPage + 1);
    }
  };

  const handleGenreSelect = useCallback(
    (genreId: number, genreName: string) => {
      setSelectedGenreId(genreId);
      setHeading(`${genreName} Games`);
      setGameList([]);
      fetchGamesByPage(1);
    },
    [fetchGamesByPage]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSelectedGenreId(null);
    setHeading(`Search results for '${searchQuery}'`);
    setGameList([]);
    fetchGamesByPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setGameList([]);
    fetchGamesByPage(newPage);
  };

  const toggleGenreList = () => {
    setIsGenreListVisible((prev) => !prev);
  };

  return (
    <div className="p-8 relative">
      <button
        onClick={toggleGenreList}
        className="fixed left-2 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800 text-white px-3 py-2 rounded-full lg:hidden"
        aria-label={isGenreListVisible ? "Hide genres" : "Show genres"}
      >
        {isGenreListVisible ? "← Hide" : "Show →"}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <GenreList
          onGenreSelect={handleGenreSelect}
          isVisible={isGenreListVisible}
          onToggle={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <div className="col-span-1 lg:col-span-3">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <h2 className="text-4xl font-bold">{heading}</h2>
            <div className="flex items-center space-x-2">
              <input
                type="search"
                placeholder="Search games"
                value={searchQuery}
                onChange={handleSearchChange}
                className="text-black h-10 rounded-full px-4"
              />
              <button
                onClick={handleSearch}
                className="h-10 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
          <GamesByGenresId gameList={gameList} shouldRender={true} />
          {isLoading && <p className="my-4 text-center">Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
