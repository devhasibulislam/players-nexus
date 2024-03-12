import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type ListCardsProps = {
  currentCategory: string;
  email: string | null;
};

const ListCards: React.FC<ListCardsProps> = ({ currentCategory, email }) => {
  const [lists, setLists] = useState<any[]>([]);

  function fetchData() {
    if (!email && typeof window !== undefined) {
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
  }

  useEffect(() => {
    fetchData();
  }, []);

  const preciseLists = lists.filter(
    (list) => list.listName === currentCategory
  );

  const router = useRouter();

  const navigateToGame = (slug: string) => {
    router.push(`/game/${encodeURIComponent(slug)}`);
  };

  const placeholderImage = "/no_image.jpg";

  const deleteListItem = async (docId: string) => {
    await deleteDoc(doc(db, "lists", docId));
    setLists((prevLists) => prevLists.filter((item) => item.docId !== docId));

    fetchData();
  };

  const path = usePathname();

  return preciseLists?.length === 0 ? (
    <>No Games Found!</>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {preciseLists?.map(({ game: item, docId }: any) => (
        <div key={item.id} className="relative">
          <div className="h-[300px]">
            <Image
              src={item.background_image || placeholderImage}
              alt={item.name}
              height={300}
              width={200}
              className="rounded-lg h-full w-full object-cover hover:scale-105 transition-all cursor-pointer"
              onClick={() => navigateToGame(item.slug)}
            />
          </div>

          {!path.includes("friends") && (
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-6 w-6 z-10"
              onClick={() => deleteListItem(docId)}
            >
              &times;
            </button>
          )}

          <p className="text-sm mt-1 font-medium">{item?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ListCards;
