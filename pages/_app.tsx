// pages/_app.tsx
import React, { useEffect, useState, useCallback } from "react";
import { AppProps } from "next/app";
import { Session } from "next-auth";
import SessionProvider from "./SessionProvider";
import Navbar from "../components/Navbar";
import LoadingCircle from "../components/LoadingCircle";
import globalapi from "../services/globalapi";
import "../styles/tailwind.css";
import useCurrentUser from "../hooks/useCurrentUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Game {
  id: number;
  name: string;
}

interface MyAppProps extends AppProps {
  pageProps: {
    session?: Session;
  };
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: MyAppProps) {
  const [allGameList, setAllGameList] = useState<Game[]>([]);
  const [gameListByGenres, setGameListByGenres] = useState<Game[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const user = useCurrentUser();

  useEffect(() => {
    if (typeof window !== undefined && user) {
      localStorage.setItem("userID", user?.uid);
    }

    setIsMounted(true);
    getAllGamesList();
    return () => {
      setIsMounted(false);
    };
  }, [user]);

  const getAllGamesList = async () => {
    setIsLoading(true);
    try {
      const response = await globalapi.getGames();
      if (isMounted) {
        setAllGameList(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching initial games:", error);
    }
    setIsLoading(false);
  };

  const handleGenreSelect = useCallback(
    (genreId: number, genreName: string) => {
      setSelectedGenreId(genreId);
      setIsLoading(true);
      globalapi
        .getGameListByGenreId(genreId)
        .then((response) => {
          if (isMounted) {
            setGameListByGenres(response.data.results);
          }
        })
        .catch((error) => {
          console.error(`Error fetching games by genre ${genreName}:`, error);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    },
    [isMounted]
  );

  const homePageProps = {
    allGameList,
    gameListByGenres,
    onGenreSelect: handleGenreSelect,
  };

  const isSignInOrSignUpPage = ["/signin", "/signup", "/get-started"].includes(
    router.pathname
  );

  return (
    <SessionProvider session={session}>
      <div className="bg-gray-900 text-white min-h-screen">
        {!isSignInOrSignUpPage && <Navbar />}{" "}
        {/* Conditionally render Navbar */}
        <Component
          {...pageProps}
          {...(isSignInOrSignUpPage ? {} : homePageProps)}
        />
        {isLoading && <LoadingCircle />}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
    </SessionProvider>
  );
}

export default MyApp;
