import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import SmallAnswerList from "../components/SmallAnswerList";
import { answer } from "@/data/answer.js";
import AnswerList from "../components/AnswerList";
import TempAnswerList from "@/components/tempAnswerList";
import Question from "@/components/Question";
import MbtiSelector from "@/components/mbtiSelector";
import { is } from "date-fns/locale";
import mbtiColors from "@/data/mbtiColors.js";

const Main = ({ isAnsweredToday }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answerList, setAnswerList] = useState([]);
  const [mbti, setMbti] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정

  const formattedDate = new Date(
    currentDate.getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setIsLoggedIn(true);
          setMbti(userDoc.data().mbti);

          const userMbti = userDoc.data().mbti; // 세션 유저의 mbti 가져오기
          const mbtiColor = mbtiColors[userMbti]; // mbtiColors에서 해당 mbti의 색상 가져오기

          if (mbtiColor) {
            setBgColor(mbtiColor);
          }
        }
      }
    }

    fetchUser();
  }, [session]);

  return (
    <>
      {isLoggedIn ? (
        <>

          <div className="flex flex-row items-start h-full">
            <div className="basis-1/3 sticky top-0">
              <div className="mb-10 w-full rounded-xl drop-shadow-md"
                style={{backgroundColor: bgColor}}>

                <Question
                  isAnsweredToday={isAnsweredToday}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center basis-2/3 px-10 w-full">
              <TempAnswerList date={formattedDate} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col w-full mb-10 items-center">
            <img
              src="/images/Amber.png"
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
    </>
  );
};
export default Main;
