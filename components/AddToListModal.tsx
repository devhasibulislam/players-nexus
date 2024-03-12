import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import useCurrentUser from "../hooks/useCurrentUser";
import useGetUser from "../hooks/useGetUser";
import { uid } from "uid";
import {toast} from "react-toastify";

type AddToListModalProps = {
  gameInfo: any;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddToListModal: React.FC<AddToListModalProps> = ({
  gameInfo,
  setShowModal,
}) => {
  const currentUser = useCurrentUser();
  const userId = currentUser?.uid;
  const user = useGetUser();
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    let email: string | null = "";

    if (typeof window !== undefined) {
      email = localStorage.getItem("email");
    }

    const retrieveData = async () => {
      const listQuery = query(
        collection(db, "lists"),
        where("userId", "==", email)
      );

      const querySnapshot = await getDocs(listQuery);

      querySnapshot.forEach((doc) => {
        setLists((prevLists) => [...prevLists, doc.data()]);
      });
    };

    retrieveData();
  }, []);

  const handleCreateNewList = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const list = (e.target as HTMLFormElement).list.value;
    const docId = uid();

    const listRef = doc(db, "lists", docId);

    const existingList = lists.find((item) => item.listName === list);
    if (existingList) {
      // Show error toast if the list already exists
      toast.error("List already exists.");
      return;
    }

    await setDoc(listRef, {
      game: { ...gameInfo },
      listName: list,
      userId: user?.email,
      docId: docId,
      createdAt: new Date(),
    });

    setShowModal(false);
  };

  async function handleAddToExistingList(listName: string) {
    const docId = uid();

    const listRef = doc(db, "lists", docId);

    const existingGameInList = lists.find(
      (item) => item.listName === listName && item.game.id === gameInfo.id
    );
    if (existingGameInList) {
      // Show error toast if the game already exists in the list
      toast.error("Game already exists in this list.", {toastId: "addToList"});
      return;
    }

    await setDoc(listRef, {
      game: { ...gameInfo },
      listName,
      userId: user?.email,
      docId: docId,
      createdAt: new Date(),
    });

    setShowModal(false);
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

        <form
          className="w-full flex flex-row gap-x-2"
          onSubmit={handleCreateNewList}
        >
          <input
            type="text"
            name="list"
            id="list"
            placeholder="Create custom list..."
            className="w-full rounded text-black"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add
          </button>
        </form>

        <div className="mt-4">
          <h2 className="font-bold text-xl">Your Own Lists</h2>

          <div className="flex flex-wrap gap-2 mt-2">
            {lists
              ?.filter(
                (list, index, self) =>
                  index === self.findIndex((t) => t.listName === list.listName)
              )
              .map((list, index) => (
                <p
                  key={index}
                  className="w-fit px-4 py-1 bg-cyan-100/50 border border-cyan-950 text-cyan-950 rounded-full cursor-pointer"
                  onClick={() => handleAddToExistingList(list?.listName)}
                >
                  {list?.listName}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;
