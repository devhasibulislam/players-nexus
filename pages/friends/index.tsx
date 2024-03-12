import React, { useState } from "react";
import MyFriends from "../../components/MyFriends";
import Activities from "../../components/Activities";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Friends() {
  const [tab, setTab] = useState<any>("Friends");
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex flex-col gap-y-6">
        <div className="flex gap-4 justify-center items-center">
          <button
            type="button"
            className={`px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 ${
              tab === "Friends" ? "bg-blue-900" : ""
            }`}
            onClick={() => setTab("Friends")}
          >
            Friends
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 ${
              tab === "Activities" ? "bg-blue-900" : ""
            }`}
            onClick={() => setTab("Activities")}
          >
            Activities
          </button>
        </div>

        {tab === "Friends" && <MyFriends />}
        {tab === "Activities" && <Activities />}
      </div>
    </section>
  );
}

export default Friends;
