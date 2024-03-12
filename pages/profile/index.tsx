import React, { useEffect, useState } from "react";
import useGetUser from "../../hooks/useGetUser";
import LoadingCircle from "../../components/LoadingCircle";
import NewsHeading from "../../components/NewsHeading";
import UserRatings from "../../components/UserRatings";
import UserReviews from "../../components/UserReviews";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import ListCards from "../../components/ListCards";
import Link from "next/link";

function Profile() {
  const user = useGetUser();
  const [currentCategory, setCurrentCategory] = useState<string>("Ratings");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [lists, setLists] = useState<any[]>([]);
  const categories = ["Ratings", "Reviews"];

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
        <h1 className="text-center mt-2 text-2xl">{user?.username}</h1>
        {user?.bio && (
          <Link
            href={user?.bio}
            target="_blank"
            className="text-center block w-fit mx-auto"
          >
            {user?.bio}
          </Link>
        )}
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => window.open("/profile/edit", "_self")}
        >
          Edit Profile
        </button>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-4">
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
        {currentCategory === "Ratings" && <UserRatings email={null} />}
        {currentCategory === "Reviews" && <UserReviews email={null} />}
        {!(currentCategory === "Ratings" || currentCategory === "Reviews") && (
          <ListCards email={null} currentCategory={currentCategory} />
        )}
      </div>
    </div>
  );
}

export default Profile;
