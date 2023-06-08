import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/index.js";
import Main from "./main-page";
import Footer from "../components/Footer";
import Layout from "@/components/Layout";
import Today from "@/pages/today";
import HorizonAnswerList from "@/components/HorizonAnswerList";

export default function Home() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnsweredToday, setIsAnsweredToday] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-between ">
        <Layout whichPage={"ranking"}>
          <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-left">
            <HorizonAnswerList range={1} />
          </div>
          <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-right">
            <HorizonAnswerList range={2} />
          </div>
          <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-left">
            <HorizonAnswerList range={3} />
          </div>
        </Layout>
        <Footer />
      </div>
    </>
  );
}
