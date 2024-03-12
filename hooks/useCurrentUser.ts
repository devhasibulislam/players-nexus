// src/hooks/useCurrentUser.ts
import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase"; // adjust the import path
import { User } from "firebase/auth";

const useCurrentUser = (): User | null => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return currentUser;
};

export default useCurrentUser;
