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

const Main = ({ isAnsweredToday, setIsAnsweredToday }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answerList, setAnswerList] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setIsLoggedIn(true);
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
          <div className="flex flex-row">
            <div className="basis-1/3 flex flex-col bg-neutral-100 items-center">
              <Question
                isAnsweredToday={isAnsweredToday}
                setIsAnsweredToday={setIsAnsweredToday}
              />
            </div>
            <div className="basis-2/3 px-10 w-full">
              {/* content 이 부분은 한번에 렌더링 할거긴 함 */}
              <TempAnswerList />
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
