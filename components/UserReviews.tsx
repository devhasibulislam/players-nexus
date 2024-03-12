import Image from "next/image";
import React, { useState, useEffect } from "react";
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
import Sentiment from "sentiment";
import ModifyReviews from "./ModifyReviews";

const sentiment = new Sentiment();

type UserReviewsProps = {
  email: string | null;
};

const UserReviews: React.FC<UserReviewsProps> = ({ email }) => {
  const router = useRouter();
  const [listReviews, setListReviews] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState({
    reviewTitle: "",
    reviewText: "",
    docId: "",
  });
  const [sortOption, setSortOption] = useState<string>("");
  const path = usePathname();

  function fetchData() {
    setListReviews([]);

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
        setListReviews((prevLists) => [...prevLists, doc.data()]);
      });
    };

    retrieveData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  const navigateToGame = (slug: string) => {
    router.push(`/game/${encodeURIComponent(slug)}`);
  };

  const placeholderImage = "/no_image.jpg";

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    // Add logic to sort reviews based on the selected option
    // For simplicity, I'm assuming createdAt is a timestamp, adjust accordingly
    if (event.target.value === "newest") {
      setListReviews((prevLists) =>
        [...prevLists].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
      );
    } else if (event.target.value === "oldest") {
      setListReviews((prevLists) =>
        [...prevLists].sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
      );
    } else {
      setListReviews([...listReviews]);
    }
  };

  // only filter which rating won't have reviewTitle and reviewText
  const reviews = listReviews?.filter((rating: any) => rating.review) || [];

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
      emoji = "🫢"; // Surprise
    }

    return emoji;
  }

  const deleteListItem = async (docId: string) => {
    await deleteDoc(doc(db, "ratings", docId));

    setShowModal(false);

    fetchData();
  };

  return reviews?.length === 0 ? (
    <>No Reviews Found!.</>
  ) : (
    <div className="flex flex-col gap-y-4">
      <select
        name="duration"
        id="duration"
        className="text-black w-fit px-2 py-1 rounded"
        value={sortOption} // Added value attribute to select the current option
        onChange={handleSortChange} // Added onChange event handler
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 items-end">
        {reviews?.map(({ game: item, review, createdAt, docId }: any) => (
          <div key={item.id} className="flex flex-col gap-y-4">
            <div
              className="flex flex-row gap-x-4 relative"
              onClick={() =>
                setReview({
                  reviewTitle: review.reviewTitle,
                  reviewText: review.reviewText,
                  docId: docId,
                })
              }
            >
              <Image
                src={item.background_image || placeholderImage}
                alt={item.name}
                height={150}
                width={150}
                style={{ objectFit: "cover" }}
                className="rounded-lg h-[150px] w-[150px] object-cover cursor-pointer hover:scale-105 transition-all"
                onClick={() => setShowModal(true)}
              />

              {!path.includes("friends") && (
                <button
                  type="button"
                  className="absolute md:top-2 md:right-2 text-white text-xl rounded-full z-20 md:block hidden"
                  onClick={() => deleteListItem(docId)}
                >
                  &times;
                </button>
              )}
              {!path.includes("friends") && (
                <button
                  type="button"
                  className="absolute bottom-2 left-2 text-white text-xl rounded-full z-20 md:hidden"
                  onClick={() => deleteListItem(docId)}
                >
                  &times;
                </button>
              )}
              <div
                className="flex flex-col gap-y-0.5 cursor-pointer"
                onClick={() => navigateToGame(item.slug)}
              >
                <h1 className="font-semibold text-xl">{item.name}</h1>
                <p>
                  {Array.from({ length: Math.floor(item.rating) }, (_, i) => (
                    <span key={i} className="text-yellow-600">
                      ★
                    </span>
                  ))}
                </p>
                <p className="text-sm">
                  {new Date(createdAt.seconds * 1000).toLocaleString()}
                </p>

                <p className="text-sm">
                  Impression:{" "}
                  {reviewStats(
                    review?.reviewTitle
                      .replace(/[^a-zA-Z\s]/g, "")
                      .toLowerCase()
                  )}
                </p>

                <p className="flex flex-col gap-y-0.5">
                  <span className="text-sm">{review?.reviewTitle}</span>
                  <span className="text-xs font-mono">
                    {review?.reviewText}
                  </span>
                </p>
              </div>
            </div>
            <hr />
          </div>
        ))}

        {showModal && (
          <ModifyReviews
            reviewText={review?.reviewText}
            reviewTitle={review?.reviewTitle}
            docId={review?.docId}
            setShowModal={setShowModal}
            fetchData={fetchData}
          />
        )}
      </div>
    </div>
  );
};

export default UserReviews;
