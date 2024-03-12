import { doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";

type ModifyReviewsProps = {
  reviewText: string;
  reviewTitle: string;
  docId: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: any;
};

const ModifyReviews: React.FC<ModifyReviewsProps> = ({
  reviewText,
  reviewTitle,
  docId,
  setShowModal,
  fetchData,
}) => {
  const [reviewTitleClone, setReviewTitleClone] = useState("");
  const [reviewTextClone, setReviewTextClone] = useState("");

  useEffect(() => {
    setReviewTitleClone(reviewTitle);
    setReviewTextClone(reviewText);
  }, [reviewTitle, reviewText]);

  async function handleModifyReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const ratingsRef = doc(db, "ratings", docId);

    // Update the ratings in the database
    await updateDoc(ratingsRef, {
      review: {
        reviewText: reviewTextClone,
        reviewTitle: reviewTitleClone,
      },
    });

    setShowModal(false);
    fetchData();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-black text-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
        <button
          onClick={() => setShowModal(false)}
          className="text-xl hover:text-gray-500 mb-4 ml-auto flex"
        >
          &times;
        </button>

        <form className="flex flex-col gap-y-2" onSubmit={handleModifyReview}>
          <input
            type="text"
            name="reviewTitle"
            placeholder="Title of your review"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            value={reviewTitleClone}
            onChange={(e) => setReviewTitleClone(e.target.value)}
          />
          <textarea
            name="reviewText"
            placeholder="Write your review"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            value={reviewTextClone}
            onChange={(e) => setReviewTextClone(e.target.value)}
            rows={4}
          ></textarea>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifyReviews;
