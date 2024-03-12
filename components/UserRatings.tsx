import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import ModifyRatings from "./ModifyRatings";

type UserRatingsProps = {
  email: string | null;
};

const UserRatings: React.FC<UserRatingsProps> = ({ email }) => {
  const router = useRouter();
  const [listRatings, setListRatings] = useState<any[]>([]);
  const [filterListRatings, setFilterListRatings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState({
    overall: 0,
    story: 0,
    gameplay: 0,
    graphics: 0,
    audio: 0,
    multiplayer: 0,
    docId: "",
  });
  const path = usePathname();

  function fetchData() {
    setListRatings([]);
    setFilterListRatings([]);

    if (!email && typeof window !== undefined) {
      email = localStorage.getItem("email");
    }

    const retrieveData = async () => {
      const listQuery = query(
        collection(db, "ratings"),
        where("userId", "==", email)
      );

      const querySnapshot = await getDocs(listQuery);

      querySnapshot.forEach((doc) => {
        setListRatings((prevLists) => [...prevLists, doc.data()]);
        setFilterListRatings((prevLists) => [...prevLists, doc.data()]);
      });
    };

    retrieveData();
  }

  useEffect(() => {
    fetchData();
  }, [email]);

  const navigateToGame = (slug: string) => {
    router.push(`/game/${encodeURIComponent(slug)}`);
  };

  const placeholderImage = "/no_image.jpg";

  // Filter out ratings without 'ratings' object and calculate average
  const ratings =
    filterListRatings
      .filter((rating: any) => rating.ratings)
      .map((rating: any) => ({
        ...rating,
        averageRating:
          Object.values(rating.ratings as Record<string, number>).reduce(
            (acc: number, curr: number) => acc + curr,
            0
          ) / Object.keys(rating.ratings).length,
      })) || [];

  const deleteListItem = async (docId: string) => {
    await deleteDoc(doc(db, "ratings", docId));

    setShowModal(false);

    fetchData();
  };

  const handleOverallChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const sortedList = [...listRatings].sort((a, b) => {
      const ratingA = a.ratings?.overall || 0;
      const ratingB = b.ratings?.overall || 0;
      return selectedValue === "highest"
        ? ratingB - ratingA
        : ratingA - ratingB;
    });
    setFilterListRatings(sortedList);
  };

  const handleGameplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const sortedList = [...listRatings].sort((a, b) => {
      const ratingA = a.ratings?.overall || 0;
      const ratingB = b.ratings?.overall || 0;
      return selectedValue === "highest"
        ? ratingB - ratingA
        : ratingA - ratingB;
    });
    setFilterListRatings(sortedList);
  };

  const handleGraphicsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const sortedList = [...listRatings].sort((a, b) => {
      const ratingA = a.ratings?.overall || 0;
      const ratingB = b.ratings?.overall || 0;
      return selectedValue === "highest"
        ? ratingB - ratingA
        : ratingA - ratingB;
    });
    setFilterListRatings(sortedList);
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const sortedList = [...listRatings].sort((a, b) => {
      const ratingA = a.ratings?.overall || 0;
      const ratingB = b.ratings?.overall || 0;
      return selectedValue === "highest"
        ? ratingB - ratingA
        : ratingA - ratingB;
    });
    setFilterListRatings(sortedList);
  };

  const handleMultiplayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const sortedList = [...listRatings].sort((a, b) => {
      const ratingA = a.ratings?.overall || 0;
      const ratingB = b.ratings?.overall || 0;
      return selectedValue === "highest"
        ? ratingB - ratingA
        : ratingA - ratingB;
    });
    setFilterListRatings(sortedList);
  };

  const handleStoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const sortedList = [...listRatings].sort((a, b) => {
      const ratingA = a.ratings?.overall || 0;
      const ratingB = b.ratings?.overall || 0;
      return selectedValue === "highest"
        ? ratingB - ratingA
        : ratingA - ratingB;
    });
    setFilterListRatings(sortedList);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          name="overall"
          id="overall"
          className="text-black w-fit px-2 py-1 rounded"
          defaultValue="overall"
          onChange={handleOverallChange}
        >
          <option value="overall">Overall</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
        <select
          name="story"
          id="story"
          className="text-black w-fit px-2 py-1 rounded"
          defaultValue="story"
          onChange={handleStoryChange}
        >
          <option value="story">Story</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
        <select
          name="gameplay"
          id="gameplay"
          className="text-black w-fit px-2 py-1 rounded"
          defaultValue="gameplay"
          onChange={handleGameplayChange}
        >
          <option value="gameplay">Gameplay</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
        <select
          name="graphics"
          id="graphics"
          className="text-black w-fit px-2 py-1 rounded"
          defaultValue="graphics"
          onChange={handleGraphicsChange}
        >
          <option value="graphics">Graphics</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
        <select
          name="audio"
          id="audio"
          className="text-black w-fit px-2 py-1 rounded"
          defaultValue="audio"
          onChange={handleAudioChange}
        >
          <option value="audio">Audio</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
        <select
          name="multiplayer"
          id="multiplayer"
          className="text-black w-fit px-2 py-1 rounded"
          defaultValue="multiplayer"
          onChange={handleMultiplayerChange}
        >
          <option value="multiplayer">Multiplayer</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
      </div>

      {ratings?.length === 0 ? (
        <>No Ratings Found!</>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {ratings.map(({ game: item, ratings, docId }: any) => (
            <div
              key={item.id}
              className="flex flex-col gap-y-2 group"
              onClick={() => setRating({ ...ratings, docId })}
            >
              <div
                className="h-[300px] relative group"
                onClick={() => setShowModal(true)}
              >
                <div className="h-[300px]">
                  <Image
                    src={item.background_image || placeholderImage}
                    alt={item.name}
                    height={300}
                    width={200}
                    className="rounded-lg h-full w-full object-cover"
                  />
                </div>
                <div className="absolute top-0 left-0 z-10 bg-black/80 w-full h-full rounded-lg opacity-0 group-hover:opacity-100 flex flex-col gap-y-0.5 justify-center items-center cursor-pointer">
                  <span className="cursor-text">
                    Overall: ⭐ {ratings?.overall}{" "}
                  </span>
                  <span className="cursor-text">
                    Story: ⭐ {ratings?.story}{" "}
                  </span>
                  <span className="cursor-text">
                    Gameplay: ⭐ {ratings?.gameplay}{" "}
                  </span>
                  <span className="cursor-text">
                    Graphics: ⭐ {ratings?.graphics}{" "}
                  </span>
                  <span className="cursor-text">
                    Audio: ⭐ {ratings?.audio}{" "}
                  </span>
                  <span className="cursor-text">
                    Multiplayer: ⭐ {ratings?.multiplayer}{" "}
                  </span>
                </div>

                {!path.includes("friends") && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-white rounded-full h-6 w-6 z-20 text-2xl opacity-0 group-hover:opacity-100"
                    onClick={() => deleteListItem(docId)}
                  >
                    &times;
                  </button>
                )}

                <p className="text-sm absolute bottom-2 left-0 text-white rounded-full w-full z-20 opacity-0 group-hover:opacity-100 text-center">
                  {item?.name}
                </p>
              </div>
              <p
                className="text-sm hover:underline cursor-pointer flex items-center gap-x-1"
                onClick={() => navigateToGame(item.slug)}
              >
                {/* Average: ⭐ {averageRating.toFixed(2)} */}
                Overall:
                {Array.from(
                  { length: Math.floor(ratings?.overall) },
                  (_, i) => (
                    <span key={i} className="text-yellow-600 text-xl">
                      ★
                    </span>
                  )
                )}
              </p>
            </div>
          ))}

          {showModal && (
            <ModifyRatings
              overall={rating?.overall}
              story={rating?.story}
              gameplay={rating?.gameplay}
              graphics={rating?.graphics}
              audio={rating?.audio}
              multiplayer={rating?.multiplayer}
              docId={rating?.docId}
              setShowModal={setShowModal}
              fetchData={fetchData}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UserRatings;
