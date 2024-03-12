/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";

function Navbar() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    if (typeof window !== undefined) {
      localStorage.removeItem("email");
      localStorage.removeItem("userID");
    }

    signOut({ callbackUrl: "/signin" });
  };

  const routes = [
    {
      name: "Games",
      path: "/",
    },
    {
      name: "Profile",
      path: "/profile",
    },
    {
      name: "News",
      path: "/news",
    },
    {
      name: "Friends",
      path: "/friends",
    },
    // {
    //   name: "Sentiment",
    //   path: "/sentiment-analysis",
    // },
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-row items-center justify-between mx-auto p-4 relative">
        <button
          type="button"
          className="border rounded-full p-1 md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          <IoMdMenu className="h-6 w-6" />
        </button>

        {showMenu && (
          <div className="absolute top-full left-0 w-full h-fit flex flex-col gap-y-2 bg-[#111726] p-4 md:hidden z-[9999]">
            {routes?.map((route, index) => (
              <Link
                key={index}
                href={route.path}
                className="text-lg font-medium"
                onClick={() => setShowMenu(false)}
              >
                {route.name}
              </Link>
            ))}
          </div>
        )}

        <Link href="/" className="text-2xl font-semibold whitespace-nowrap">
          Player's Nexus
        </Link>

        <div className="md:flex flex-row gap-x-4 hidden">
          {routes?.map((route, index) => (
            <Link key={index} href={route.path} className="text-lg font-medium">
              {route.name}
            </Link>
          ))}
        </div>

        {session && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
