import React, { useState, useEffect } from "react";
import StarRating from "./StarRatings";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface ModifyRatingsProps {
  overall: number;
  story: number;
  gameplay: number;
  graphics: number;
  audio: number;
  multiplayer: number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  docId: string;
  fetchData: any;
}

const ModifyRatings: React.FC<ModifyRatingsProps> = ({
  overall,
  story,
  gameplay,
  graphics,
  audio,
  multiplayer,
  setShowModal,
  docId,
  fetchData,
}) => {
  const [overallClone, setOverall] = useState(0);
  const [storyClone, setStory] = useState(0);
  const [gameplayClone, setGameplay] = useState(0);
  const [graphicsClone, setGraphics] = useState(0);
  const [audioClone, setAudio] = useState(0);
  const [multiplayerClone, setMultiplayer] = useState(0);

  useEffect(() => {
    setOverall(overall);
    setStory(story);
    setGameplay(gameplay);
    setGraphics(graphics);
    setAudio(audio);
    setMultiplayer(multiplayer);
  }, [overall, story, gameplay, graphics, audio, multiplayer]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-black text-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
        <button
          onClick={() => setShowModal(false)}
          className="text-xl hover:text-gray-500 mb-4 ml-auto flex"
        >
          &times;
        </button>

        <div className="flex flex-col space-y-8 mb-8">
          <div>
            <label className="text-white text-lg font-bold">Overall:</label>
            <StarRating rating={overallClone} setRating={setOverall} />
          </div>
          <div>
            <label className="text-whit text-lg font-bold">Story:</label>
            <StarRating rating={storyClone} setRating={setStory} />
          </div>
          <div>
            <label className="text-white text-lg font-bold">Gameplay:</label>
            <StarRating rating={gameplayClone} setRating={setGameplay} />
          </div>
          <div>
            <label className="text-white text-lg font-bold">Graphics:</label>
            <StarRating rating={graphicsClone} setRating={setGraphics} />
          </div>
          <div>
            <label className="text-white text-lg font-bold">Audio:</label>
            <StarRating rating={audioClone} setRating={setAudio} />
          </div>
          <div>
            <label className="text-white text-lg font-bold">Multiplayer:</label>
            <StarRating rating={multiplayerClone} setRating={setMultiplayer} />
          </div>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-end"
          onClick={async () => {
            const ratingsRef = doc(db, "ratings", docId);

            // Update the ratings in the database
            await updateDoc(ratingsRef, {
              ratings: {
                overall: overallClone,
                story: storyClone,
                gameplay: gameplayClone,
                graphics: graphicsClone,
                audio: audioClone,
                multiplayer: multiplayerClone,
              },
            });

            setShowModal(false);
            fetchData();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ModifyRatings;
