import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Slider from "react-slick";
import StoreLinks from "../../components/StoreLinks";
import GameDescription from "../../components/GameDescription";
import PublishersList from "../../components/PublishersList";
import RatingReviewModal from "../../components/RatingReviewModal";
import globalapi from "../../services/globalapi";
import useCurrentUser from "../../hooks/useCurrentUser";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import useGetUser from "../../hooks/useGetUser";
import AddToListModal from "../../components/AddToListModal";
import { uid } from "uid";

type PublisherType = {
  id: number;
  name: string;
};

type StoreType = {
  id: number;
  url: string;
};

type GameInfoType = {
  id: number;
  name: string;
  description_raw: string;
  background_image: string;
  background_image_additional: string;
  publishers: PublisherType[];
  reddit_url?: string;
};

type ScreenshotType = {
  id: number;
  image: string;
};

const GameInfo = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [gameInfo, setGameInfo] = useState<GameInfoType | null>(null);
  const [screenshots, setScreenshots] = useState<ScreenshotType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const currentUser = useCurrentUser();
  const userId = currentUser?.uid;
  const user = useGetUser();

  async function fetchGameData(slug: string) {
    try {
      const gameDataResponse = await globalapi.getGameBySlug(slug);
      const gameData = gameDataResponse.data;
      setGameInfo(gameData);

      const screenshotsResponse = await globalapi.getGameScreenshots(
        gameData.id
      );
      setScreenshots(screenshotsResponse);

      const storeLinksResponse = await globalapi.getGameStores(slug);
      setStores(storeLinksResponse);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  }

  console.log(gameInfo, "Game Info");

  useEffect(() => {
    // @ts-ignore
    fetchGameData(slug);

    if (typeof slug === "string" && slug !== "" && userId && !gameInfo) {
      fetchGameData(slug);
    }
  }, [slug, userId, gameInfo]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const handleReviewSubmit = async (review: any) => {
    try {
      const docId = uid();
      const ratingDocRef = doc(db, "ratings", docId);

      const {
        reviewTitle,
        reviewText,
        audio,
        story,
        gameplay,
        graphics,
        multiplayer,
        overall,
      } = review;
      let gameReview: any = {};

      if (reviewTitle && reviewText) {
        gameReview = {
          ...gameReview,
          review: {
            reviewTitle,
            reviewText,
          },
        };
      }

      if (audio && story && gameplay && graphics && multiplayer && overall) {
        gameReview = {
          ...gameReview,
          ratings: {
            audio,
            story,
            gameplay,
            graphics,
            multiplayer,
            overall,
          },
        };
      }

      if (Object.keys(gameReview).length > 0) {
        await setDoc(ratingDocRef, {
          ...gameReview,
          game: { ...gameInfo },
          userId: user?.email,
          docId: docId,
          createdAt: new Date(),
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!gameInfo) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="relative overflow-visible">
      {/* Background image and gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${gameInfo.background_image_additional})`,
          height: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
      </div>

      {/* Game details and store links */}
      <div className="relative container mx-auto px-4 py-24 flex flex-wrap lg:flex-nowrap">
        {/* Game image */}
        <div className="w-full lg:w-1/4 mb-4 lg:mb-0 relative">
          <div className="relative" style={{ height: "400px" }}>
            <Image
              src={gameInfo.background_image}
              alt={gameInfo.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded shadow-lg"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Rate/Review
          </button>

          {/* add to custom list */}
          <button
            onClick={() => setShowListModal(true)}
            className="md:absolute md:top-[450px] md:left-1/2 md:transform md:-translate-x-1/2 mt-2 md:ml-0 ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10"
          >
            Add to List
          </button>
        </div>

        {/* Game information */}
        <div className="w-full lg:w-1/2 lg:ml-8 mb-4 lg:mb-0">
          <h1 className="text-3xl lg:text-5xl text-white font-bold mb-2">
            {gameInfo.name}
          </h1>
          <h2 className="text-xl lg:text-2xl text-white font-light mb-4 flex items-center justify-center lg:justify-start">
            By{" "}
            <span className="ml-1">
              <PublishersList publishers={gameInfo.publishers} />
            </span>
            {gameInfo.reddit_url && (
              <a
                href={gameInfo.reddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2"
              >
                <div className="relative w-6 h-6">
                  {" "}
                  {/* Set the width and height */}
                  <Image
                    src="/images/reddit_logo.png"
                    alt="Reddit Logo"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </a>
            )}
          </h2>
          <GameDescription description={gameInfo.description_raw} />
        </div>

        {/* Store links */}
        <div className="w-full lg:w-1/4 lg:ml-4 mb-4 lg:mb-0">
          <StoreLinks stores={stores} />
        </div>
      </div>

      {/* Screenshot carousel */}
      <div
        className="flex justify-center items-center py-4 relative"
        style={{ maxWidth: "1000px", margin: "0 auto", marginTop: "-50px" }}
      >
        <div className="w-full lg:w-3/4 mx-auto">
          <h3 className="text-2xl text-white font-bold mb-4 text-center">
            Screenshots
          </h3>
          <Slider {...sliderSettings} className="screenshot-carousel">
            {screenshots.map((screenshot) => (
              <div key={screenshot.id} className="flex justify-center">
                <div key={screenshot.id} className="flex justify-center">
                  <div className="relative w-full" style={{ height: "500px" }}>
                    <Image
                      src={screenshot.image}
                      alt="Game Screenshot"
                      fill // Changed to use 'fill' for responsive layout
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <RatingReviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={handleReviewSubmit}
        gameId={gameInfo?.id}
        userId={userId}
      />

      {showListModal && (
        <AddToListModal setShowModal={setShowListModal} gameInfo={gameInfo} />
      )}
    </div>
  );
};

export default GameInfo;
