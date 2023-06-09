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
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedDate = new Date(
    currentDate.getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    async function checkAnsweredToday() {
      if (session) {
        const userId = session.user.id;
        const answersRef = collection(db, "answers");

        const answersQuery = query(
          answersRef,
          where("user.id", "==", userId),
          where("questionDate", "==", formattedDate)
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
      <div className="flex flex-col justify-between h-full">
        <Layout whichPage={"main"}>
          {isLoggedIn && !isAnsweredToday ? (
            <Today />
          ) : (
            <Main isAnsweredToday={isAnsweredToday} />
          )}
        </Layout>
        <Footer />
      </div>
    </>
  );
}
