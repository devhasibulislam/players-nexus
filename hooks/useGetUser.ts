import { useEffect, useState } from "react";
import { db } from "../firebase/firebase"; // Import the necessary functions
import { collection, doc, getDoc } from "firebase/firestore";

function useGetUser() {
  const [user, setUser] = useState<any>({}); // Assuming any type for user data

  useEffect(() => {
    if (typeof window !== undefined) {
      const email = localStorage.getItem("email");
      if (email) {
        const userRef = doc(collection(db, "users"), email); // Create a DocumentReference using collection and email
        getDoc(userRef)
          .then((doc: any) => {
            if (doc.exists()) {
              setUser(doc.data()); // Set the user data in the state
            } else {
              // Handle the case when the document does not exist
            }
          })
          .catch((error: any) => {
            // Handle any errors while fetching the document
            console.error("Error getting document:", error);
          });
      }
    }
  }, []); // Add user as a dependency for the effect

  return user; // Return the user state
}

export default useGetUser;
