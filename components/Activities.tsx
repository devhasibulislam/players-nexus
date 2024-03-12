import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import Image from "next/image";
import { differenceInDays, differenceInWeeks } from "date-fns";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

const Activities = () => {
  const [myFriends, setMyFriends] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    let email: string | null = "";

    if (typeof window !== undefined) {
      email = localStorage.getItem("email");
    }

    const retrieveData = async () => {
      const listQuery = query(
        collection(db, "friends"),
        where("userId", "==", email)
      );

      const querySnapshot = await getDocs(listQuery);

      const friendsData = querySnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        };
      });

      setMyFriends(friendsData);
    };

    retrieveData();
  }, []);

  function fetchData(email: string) {
    const retrieveFeedbacks = async () => {
      const listQuery = query(
        collection(db, "ratings"),
        where("userId", "==", email)
      );

      const querySnapshot = await getDocs(listQuery);

      querySnapshot.forEach((doc) => {
        setFeedbacks((prevLists) => [...prevLists, doc.data()]);
      });
    };

    const retrieveLists = async () => {
      const listQuery = query(
        collection(db, "lists"),
        where("userId", "==", email)
      );

      const querySnapshot = await getDocs(listQuery);

      querySnapshot.forEach((doc) => {
        setLists((prevLists) => [...prevLists, doc.data()]);
      });
    };

    retrieveFeedbacks();
    retrieveLists();
  }

  useEffect(() => {
    if (myFriends.length > 0) {
      myFriends.forEach((friend) => {
        fetchData(friend?.friend?.email);
      });
    }
  }, [myFriends]);

  function findMyFriend(friendEmail: string) {
    const friend = myFriends.find(
      (friend) => friend?.friend?.email === friendEmail
    );

    return friend?.friend;
  }

  const formatTimeDifference = (createdAtSeconds: number) => {
    const createdAtDate = new Date(createdAtSeconds * 1000);
    const currentDate = new Date();

    const secondsDifference = Math.floor(
      (currentDate.getTime() - createdAtDate.getTime()) / 1000
    );
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(daysDifference / 365);

    if (yearsDifference > 0) {
      return `${yearsDifference}y ago`;
    } else if (monthsDifference > 0) {
      return `${monthsDifference}mo ago`;
    } else if (weeksDifference > 0) {
      return `${weeksDifference}w ago`;
    } else if (daysDifference > 0) {
      return `${daysDifference}d ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference}h ago`;
    } else if (minutesDifference > 0) {
      return `${minutesDifference}m ago`;
    } else {
      return `${secondsDifference}s ago`;
    }
  };

  function reviewStats(review: string) {
    const result = sentiment.analyze(review);
    console.log(result);

    const score = result.score;

    // Map sentiment score to emojis
    let emoji = "";

    if (score > 0) {
      emoji = "😍"; // Happy
    } else if (score >= -2 && score < 0) {
      emoji = "😭"; // Sad
    } else if (score >= -5 && score < -2) {
      emoji = "😡"; // Angry
    } else {
      emoji = "😮"; // Surprise
    }

    return emoji;
  }

  return (
    <section className="flex flex-col gap-y-4 mb-4">
      {feedbacks
        ?.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        ?.map((feedback, index) => {
          const friend = findMyFriend(feedback?.userId);
          console.log(feedback);

          return (
            <>
              <div
                key={feedback?.docId}
                className="flex flex-row gap-y-1 justify-between items-start"
              >
                <div className="flex flex-row gap-x-2 gap-y-2 items-start">
                  <div className="flex flex-row gap-x-4 items-start">
                    <div className="h-[50px] w-[50px]">
                      <Image
                        src={friend?.avatar}
                        alt={friend?.username}
                        height={50}
                        width={50}
                        className="h-[50px] w-[50px] object-cover rounded-full cursor-pointer"
                        style={{
                          objectFit: "cover",
                          height: "50px !important",
                          width: "50px !important",
                        }}
                        onClick={() =>
                          window.open(`/friends/${friend?.email}`, "_self")
                        }
                      />
                    </div>
                    <div className="h-[150px] w-[150px] flex relative group">
                      <Image
                        src={feedback?.game?.background_image}
                        alt={feedback?.game?.name}
                        height={150}
                        width={150}
                        className="!h-[150px] !w-[150px] object-cover rounded cursor-pointer"
                        style={{
                          objectFit: "cover",
                          height: "150px !important",
                          width: "150px !important",
                        }}
                      />

                      <div
                        className="absolute top-0 left-0 z-10 bg-black/80 w-full h-full rounded opacity-0 group-hover:opacity-100 flex flex-col gap-y-0.5 justify-center items-center cursor-pointer text-sm whitespace-nowrap"
                        onClick={() =>
                          window.open(
                            `/game/${encodeURIComponent(feedback?.game?.slug)}`,
                            "_self"
                          )
                        }
                      >
                        <span className="cursor-text">
                          Overall: ⭐ {feedback?.ratings?.overall}{" "}
                        </span>
                        <span className="cursor-text">
                          Story: ⭐ {feedback?.ratings?.story}{" "}
                        </span>
                        <span className="cursor-text">
                          Gameplay: ⭐ {feedback?.ratings?.gameplay}{" "}
                        </span>
                        <span className="cursor-text">
                          Graphics: ⭐ {feedback?.ratings?.graphics}{" "}
                        </span>
                        <span className="cursor-text">
                          Audio: ⭐ {feedback?.ratings?.audio}{" "}
                        </span>
                        <span className="cursor-text">
                          Multiplayer: ⭐ {feedback?.ratings?.multiplayer}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <p className="flex gap-x-1 items-center">
                      <span className="font-medium">{friend?.username}</span>
                      gives
                      <span className="font-medium">
                        {feedback?.game?.name}
                      </span>
                    </p>
                    {feedback?.ratings && (
                      <p className="flex gap-x-1 items-center">
                        Rating:
                        <span className="flex flex-row gap-x-0.5 items-center">
                          {Array.from(
                            { length: Math.floor(feedback?.ratings?.overall) },
                            (_, i) => (
                              <span key={i} className="text-yellow-600 text-xl">
                                ★
                              </span>
                            )
                          )}
                        </span>
                      </p>
                    )}
                    {feedback?.review && (
                      <p className="flex flex-col gap-y-0.5">
                        <span className="flex flex-row gap-x-1 items-center">
                          Impression:
                          {reviewStats(
                            feedback?.review?.reviewTitle
                              .replace(/[^a-zA-Z\s]/g, "")
                              .toLowerCase()
                          )}
                        </span>
                      </p>
                    )}
                    {feedback?.review && (
                      <p className="flex flex-col gap-y-0.5">
                        <span className="flex flex-row gap-x-1 items-center">
                          Review:
                          <span className="text-sm whitespace-normal">
                            {feedback?.review?.reviewTitle}
                          </span>
                        </span>
                        <span className="text-xs whitespace-normal">
                          {feedback?.review?.reviewText}
                        </span>
                      </p>
                    )}
                    <span className="text-sm whitespace-nowrap">
                      on{" "}
                      {new Date(
                        feedback?.createdAt.seconds * 1000
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="text-sm whitespace-nowrap">
                  {formatTimeDifference(feedback?.createdAt.seconds)}
                </span>
              </div>
              {feedbacks?.length - 1 !== index && <hr />}
            </>
          );
        })}
    </section>
  );
};

export default Activities;
