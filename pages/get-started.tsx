import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import Image from "next/image";

const GetStarted = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setAvatar(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFinishRegistration = async () => {
    // Extract the avatar name
    const avatarName = avatar?.name;
    const storageRef = ref(storage, `avatars/${avatarName}`);

    if (avatar) {
      // Upload the avatar to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, avatar);

      // Monitor the upload task for progress and completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle upload errors
          console.error(error);
        },
        async () => {
          // When the upload is complete
          try {
            // Retrieve the download URL for the avatar
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Retrieve user email from localStorage
            let email = "";
            if (typeof window !== "undefined") {
              email = localStorage.getItem("email") || "";
            }

            // Reference to the user document in Firestore
            const userRef = doc(db, "users", email);

            // Update user document with avatar URL
            if (downloadURL) {
              await updateDoc(userRef, {
                avatar: downloadURL,
                updatedAt: new Date(),
              });

              router.push("/signin");
            }
          } catch (error) {
            // Handle errors while getting the download URL
            console.error("Error getting download URL:", error);
          }
        }
      );
    } else {
      console.error("No avatar selected");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Get Started
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            {avatarPreview ? (
              <div className="mt-2 w-fit mx-auto">
                <Image
                  src={avatarPreview}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="h-[100px] w-[100px] rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-2 w-fit mx-auto">
                <Image
                  src="https://t4.ftcdn.net/jpg/04/70/29/97/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="h-[100px] w-[100px] rounded-full object-cover"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium leading-6 text-white"
              >
                Avatar
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  required
                  className="block w-full file:rounded-md cursor-pointer file:cursor-pointer border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div>
              <button
                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleFinishRegistration}
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetStarted;
