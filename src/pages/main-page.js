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

const Main = ({ isAnsweredToday }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answerList, setAnswerList] = useState([]);
  const [mbti, setMbti] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setIsLoggedIn(true);
          setMbti(userDoc.data().mbti);
        }
      }
    }

    fetchUser();
  }, [session]);

  return (
    <>
      {/* 랜덤한 답변 보여주기 */}
      {isLoggedIn ? (
        <>
          <div className="flex flex-row items-center h-full">
            <div className=" basis-1/3 flex h-full flex-col  items-center">
              <div className="mb-10 border-4 bg-neutral-100 w-full">
                <Question
                  isAnsweredToday={isAnsweredToday}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              </div>
              <div className="border-2 border-primary mr-0 w-full">
                <MbtiSelector defaultMbti={mbti} setDefaultMbti={setMbti} />
              </div>
            </div>

            <div className="flex flex-col items-center basis-2/3 px-10 w-full">
              {/* content 이 부분은 한번에 렌더링 할거긴 함 */}

              <AnswerList
                mbti={mbti}
                date={currentDate.toISOString().split("T")[0]}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full text-center mt-5">
            로그인을 하시면 더 많은 답변을 보실 수 있습니다!
          </div>
        </>
      )}
    </>
  );
};
export default Main;
