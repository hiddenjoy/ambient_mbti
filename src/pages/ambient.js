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
      <div className="flex flex-col justify-between">
        <Layout whichPage={"ambient"}>
          {session ? (
            <>
              <h1 className="text-2xl my-2 text-left ml-2 font-extrabold">
                주변 MBTI들의 답변을 둘러볼까요? 🧐
              </h1>
              <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-left">
                <HorizonAnswerList range={1} />
              </div>
              <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-right">
                <HorizonAnswerList range={2} />
              </div>
              <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-left">
                <HorizonAnswerList range={3} />
              </div>
              <div className="grid grid-cols-10 gap-4 w-[2000px] animate-slide-right">
                <HorizonAnswerList range={4} />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full mb-10 items-center">
                <img
                  src="/images/Ambers.png"
                  alt="로그인 전 이미지"
                  style={{
                    maxWidth: "30%",
                    height: "auto",
                    maxHeight: "auto",
                    display: "block",
                    transform: "translateY(10%)",
                  }}
                />
                <div
                  className="basis-1/2 w-full text-center mt-5  "
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "#",
                    whiteSpace: "nowrap",
                  }}
                >
                  로그인 해주세요!
                </div>

                <div
                  className="basis-1/2 mb-1 w-full text-center mt-1 textAlign:'center'"
                  style={{
                    marginLeft: "-17%",
                    display: "block",
                    fontWeight: "regular",
                    marginRight: "-17%",
                    fontSize: "14px",
                    color: "#6D6E71",
                    whiteSpace: "nowrap",
                  }}
                >
                  로그인하여 당신의 이야기를 들려주세요!
                </div>
              </div>
            </>
          )}
        </Layout>
        <Footer />
      </div>
    </>
  );
}
