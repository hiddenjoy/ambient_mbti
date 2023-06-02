// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   doc,
//   getDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   orderBy,
//   where,
// } from "firebase/firestore";
// import { db } from "@/firebase/index.js";
// import Main from "./main-page";
// import Footer from "../components/Footer";
// import Layout from "@/components/Layout";
// import Today from "@/pages/today";

// export default function Home() {
//   const { data: session } = useSession();
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const answerCollection = collection(db, "answers");
//   const [isAnsweredToday, setIsAnsweredToday] = useState(false);

//   useEffect(() => {
//     async function fetchUser() {
//       if (session) {
//         const userRef = doc(db, "users", session.user.id);
//         const userDoc = await getDoc(userRef);

//         const answerRef = doc(db, "answers", session.user.id);

//         if (userDoc.exists()) {
//           setUser(userDoc.data());
//           setIsLoggedIn(true);
//         }
//       }
//     }

//     fetchUser();
//   }, [session]);

//   return (
//     <>
//       <div className="flex flex-col h-screen justify-between">
//         <Layout>{isLoggedIn && !isAnsweredToday ? <Today /> : <Main />}</Layout>

//         <Footer />
//       </div>
//     </>
//   );
// }

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/index.js";
import Main from "./main-page";
import Footer from "../components/Footer";
import Layout from "@/components/Layout";
import Today from "@/pages/today";

export default function Home() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnsweredToday, setIsAnsweredToday] = useState(false);

  useEffect(() => {
    async function checkAnsweredToday() {
      if (session) {
        const userId = session.user.id;
        const today = new Date().toISOString().split("T")[0];
        const answersRef = collection(db, "answers");

        const answersQuery = query(
          answersRef,
          where("user.id", "==", userId),
          where("questionDate", "==", today)
        );
        const answersSnapshot = await getDocs(answersQuery);

        if (answersSnapshot.size > 0) {
          setIsAnsweredToday(true);
        } else {
          setIsAnsweredToday(false);
        }

        setIsLoggedIn(true);
      }
    }

    checkAnsweredToday();
  }, [session]);

  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <Layout>{isLoggedIn && !isAnsweredToday ? <Today /> : <Main />}</Layout>
        <Footer />
      </div>
    </>
  );
}
