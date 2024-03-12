import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import LoadingCircle from "../../components/LoadingCircle";
import Image from "next/image";
import NewsHeading from "../../components/NewsHeading";
import UserRatings from "../../components/UserRatings";
import UserReviews from "../../components/UserReviews";
import ListCards from "../../components/ListCards";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UEmail: React.FC = () => {
  const router = useRouter();
  const { uemail } = router.query;
  const [user, setUser] = useState<any>({});
  const [currentCategory, setCurrentCategory] = useState<string>("Ratings");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [lists, setLists] = useState<any[]>([]);
  const categories = ["Ratings", "Reviews"];
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  useEffect(() => {
    const email = uemail || "";

    const retrieveData = async () => {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(userQuery);

      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    };

    retrieveData();
  }, [uemail]);

  useEffect(() => {
    const email = uemail || "";

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
  }, [uemail]);

  if (Object.keys(user).length === 0) {
    return <LoadingCircle />;
  }

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setIsSearchActive(false); // Reset search active state
  };

  return (
    <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="mb-6 text-center">
        <Image
          src={user?.avatar}
          alt="Avatar"
          width={150}
          height={150}
          className="h-[150px] w-[150px] rounded-full object-cover mx-auto"
        />
        <h1 className="text-center mt-2 text-xl">{user?.username}</h1>
        {user?.bio && (
          <Link
            href={user?.bio}
            target="_blank"
            className="text-center block w-fit mx-auto"
          >
            {user?.bio}
          </Link>
        )}
      </div>

      <div className="flex flex-row items-center gap-x-4">
        {categories.map((category) => (
          <NewsHeading
            key={category}
            title={category}
            isActive={!isSearchActive && currentCategory === category}
            onClick={() => handleCategoryChange(category)}
          />
        ))}
        |
        {lists
          ?.filter(
            (list, index, self) =>
              index === self.findIndex((t) => t.listName === list.listName)
          )
          .map((list, index) => (
            <NewsHeading
              key={index}
              title={list?.listName}
              isActive={!isSearchActive && currentCategory === list?.listName}
              onClick={() => handleCategoryChange(list?.listName)}
            />
          ))}
      </div>

      <div className="mt-6">
        {currentCategory === "Ratings" && (
          <UserRatings
            email={Array.isArray(uemail) ? uemail.join(",") : uemail || ""}
          />
        )}
        {currentCategory === "Reviews" && (
          <UserReviews
            email={Array.isArray(uemail) ? uemail.join(",") : uemail || ""}
          />
        )}
        {!(currentCategory === "Ratings" || currentCategory === "Reviews") && (
          <ListCards
            email={Array.isArray(uemail) ? uemail.join(",") : uemail || ""}
            currentCategory={currentCategory}
          />
        )}
      </div>
    </div>
  );
};

export default UEmail;
