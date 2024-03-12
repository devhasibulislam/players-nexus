import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { uid } from "uid";
import { useRouter } from "next/router";
import useGetUser from "../hooks/useGetUser";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";

const MyFriends = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [myFriends, setMyFriends] = useState<any[]>([]);
  const user = useGetUser();
  const router = useRouter();

  useEffect(() => {
    const fetchFriends = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      setFriends(usersData);
    };

    fetchFriends();
  }, []);

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFriend = async (friend: any) => {
    // Check if the friend is yourself
    if (user?.email === friend.email) {
      toast.error("You can't add yourself.", { toastId: "add-friend" });
      return;
    }

    // Check if the friend is already in your list
    const isAlreadyAdded = myFriends.some(
      (myFriend) => myFriend.friend.email === friend.email
    );

    // If the friend is not yourself and not already added, add them to the list
    if (!isAlreadyAdded) {
      const docId = uid();
      const friendRef = doc(db, "friends", docId);

      await setDoc(friendRef, {
        friend: { ...friend },
        userId: user?.email,
        docId: docId,
        createdAt: new Date(),
      });

      setMyFriends((prevMyFriends) => [
        ...prevMyFriends,
        { docId, friend: { ...friend } },
      ]);
    } else {
      toast.error("Friend already added.", { toastId: "add-friend" });
    }
  };

  const removeFriend = async (docId: string) => {
    await deleteDoc(doc(db, "friends", docId));
    setMyFriends((prevMyFriends) =>
      prevMyFriends.filter((friend) => friend.docId !== docId)
    );
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-bold">Search Your Friends Here:</h1>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Type your friend's username..."
          className="py-2 lg:w-1/2 md:w-3/4 w-full text-black rounded"
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="lg:w-1/2 md:w-3/4 w-full flex flex-col gap-y-4 max-h-96 overflow-y-auto">
          {filteredFriends.map((friend, index) => (
            <div
              key={index}
              className="flex flex-row justify-between items-center border rounded p-2"
            >
              <div className="flex flex-row gap-x-2 items-center">
                <Image
                  src={friend.avatar}
                  alt={friend.username}
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] object-cover rounded-full"
                />
                <p className="flex flex-col gap-y-0.5">
                  <span className="font-bold">{friend?.username}</span>
                  <span className="text-sm">{friend?.email}</span>
                </p>
              </div>
              <button
                type="submit"
                className="text-xs border px-2 py-0.5 rounded text-green-950 border-green-950 bg-green-100/50"
                onClick={() => addFriend(friend)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-bold">Here are Your Friends:</h1>
        {myFriends.length === 0 && <p>Not added friends yet!</p>}
        <div className="lg:w-1/2 md:w-3/4 w-full flex flex-col gap-y-4 max-h-96 overflow-y-auto">
          {myFriends.map(({ friend, docId }, index) => (
            <div
              key={index}
              className="flex flex-row justify-between items-center border rounded p-2"
            >
              <div className="flex flex-row gap-x-2 items-center">
                <Image
                  src={friend.avatar}
                  alt={friend.username}
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] object-cover rounded-full"
                />
                <p className="flex flex-col gap-y-0.5">
                  <span className="font-bold">{friend?.username}</span>
                  <span className="text-sm">{friend?.email}</span>
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <button
                  type="submit"
                  className="text-xs border px-2 py-0.5 rounded text-cyan-950 border-cyan-950 bg-cyan-100/50"
                  onClick={() => {
                    router.push(`/friends/${friend?.email}`);
                  }}
                >
                  View
                </button>
                <button
                  type="submit"
                  className="text-xs border px-2 py-0.5 rounded text-red-950 border-red-950 bg-red-100/50"
                  onClick={() => removeFriend(docId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFriends;
