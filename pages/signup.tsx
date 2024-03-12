import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

interface SignupState {
  username: string;
  email: string;
  password: string;
  passwordAgain: string;
  error: string;
}

export default function Signup() {
  const [{ username, email, password, passwordAgain, error }, setState] =
    useState<SignupState>({
      username: "",
      email: "",
      password: "",
      passwordAgain: "",
      error: "",
    });
  const router = useRouter();

  const updateState = (key: keyof SignupState, value: string) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const validatePassword = (): boolean => {
    if (
      password.length < 6 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      updateState("error", "Password does not meet minimum requirements");
      return false;
    }
    if (password !== passwordAgain) {
      updateState("error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const checkUsernameExists = async (): Promise<boolean> => {
    const usernameQuerySnapshot = await getDocs(collection(db, "users"));
    const usernameExists = usernameQuerySnapshot.docs.some(
      (doc) => doc.data().username === username
    );

    return usernameExists;
  };

  const signup = async () => {
    if (!validatePassword()) return;

    const usernameExists = await checkUsernameExists();
    if (usernameExists) {
      updateState("error", "Username already exists");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      /**
       * store in localStorage first
       * ---------------------------
       * store only email as unique identity
       * it helps to retrieve user when necessary
       */
      if (typeof window !== undefined) localStorage.setItem("email", email);

      /**
       * create an entity
       * ----------------
       * create an user
       * to store in database
       */
      const userRef = doc(db, "users", email);

      await setDoc(userRef, {
        username,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      /**
       * redirect
       * --------
       * after successful sign up
       * redirect to /get-started route
       * for user registration
       */
      router.push("/get-started");
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        updateState("error", "Email already in use");
      } else {
        updateState("error", "An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign up
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
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
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => updateState("username", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => updateState("email", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => updateState("password", e.target.value)}
                />
                <ul className="mt-2 text-sm text-gray-400">
                  <li>Minimum required length is 6 characters</li>
                  <li>Must contain a special character</li>
                  <li>Must contain a capital letter</li>
                </ul>
              </div>
            </div>

            <div>
              <label
                htmlFor="passwordAgain"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password Again
              </label>
              <div className="mt-2">
                <input
                  id="passwordAgain"
                  name="passwordAgain"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  onChange={(e) => updateState("passwordAgain", e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                disabled={!email || !password || !passwordAgain || !username}
                onClick={signup}
                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
