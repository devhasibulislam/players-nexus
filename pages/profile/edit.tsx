import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/router";
import Image from "next/image";
import useGetUser from "../../hooks/useGetUser";
import { toast } from "react-toastify";

const EditProfile = () => {
  const user = useGetUser();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>("");
  const [bio, setBio] = useState<string | null>("");
  const [usernameExists, setUsernameExists] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (username) {
      checkUsernameExists();
    }
  }, [username]);

  useEffect(() => {
    if (user) {
      setAvatarPreview(user.avatar);
      setUsername(user.username);
      setBio(user.bio);
    }
  }, [user]);

  const checkUsernameExists = async () => {
    const usernameQuerySnapshot = await getDocs(collection(db, "users"));
    const exists = usernameQuerySnapshot.docs.some(
      (doc) => doc.data().username === username && username !== user?.username
    );
    setUsernameExists(exists);
  };

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

  const handleEditProfile = async () => {
    // Extract the avatar name
    const avatarName = avatar?.name;
    const storageRef = ref(storage, `avatars/${avatarName}`);

    if (avatar) {
      try {
        // Delete the old avatar if it exists
        if (user && user.avatar) {
          const oldAvatarRef = ref(storage, user.avatar);
          await deleteObject(oldAvatarRef);
        }

        // Upload the new avatar to Firebase Storage
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
                  username: username,
                  bio: bio,
                  updatedAt: new Date(),
                });
                toast.success("Profile updated!", { toastId: "edit-profile" });
              }
            } catch (error) {
              // Handle errors while getting the download URL
              console.error("Error getting download URL:", error);
            }
          }
        );
      } catch (error) {
        // Handle errors while deleting the old avatar
        console.error("Error deleting old avatar:", error);
        toast.error("Error deleting old avatar:", { toastId: "edit-profile" });
      }
    } else {
      await updateDoc(doc(db, "users", user?.email), {
        username: username,
        bio: bio,
        updatedAt: new Date(),
      });
      toast.success("Profile updated!", { toastId: "edit-profile" });
    }
  };

  console.log(user);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Edit Profile
          </h2>
          {usernameExists && (
            <p className="mt-2 text-center text-sm text-red-600">
              Username already exists!
            </p>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            {
              <div className="mt-2 w-fit mx-auto">
                <Image
                  src={
                    avatarPreview ||
                    "https://t4.ftcdn.net/jpg/04/70/29/97/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                  }
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="h-[100px] w-[100px] rounded-full object-cover"
                />
              </div>
            }

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
                  className="block w-full file:rounded-md cursor-pointer file:cursor-pointer border-0 bg-white/5 p-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={username ? username : ""}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white"
              >
                Discord
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  name="bio"
                  id="bio"
                  autoComplete="bio"
                  pattern="https://discord.com/users/*"
                  value={bio ? bio : ""}
                  placeholder="https://discord.com/users/devhasibulislam"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => setBio(e.target.value)}
                />

                {/* <textarea
                  name="bio"
                  id="bio"
                  autoComplete="bio"
                  rows={2}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Write your bio"
                  value={bio ? bio : ""}
                ></textarea> */}
              </div>
            </div>

            <div>
              <button
                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleEditProfile}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
