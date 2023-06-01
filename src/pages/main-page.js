import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import SmallAnswer from "../components/SmallAnswer";
import { answer } from "@/data/answer.js";
import AnswerList from "../components/AnswerList";
import MbtiButton from "@/components/MbtiButton";

const Main = () => {
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
      {isLoggedIn ? 
      // 이전의 코드
      // (
      //   <>
      //     <div className="bg-white w-full p-5 text-black">
      //       <h1>{user?.mbti} 친구들의 답변 모아보기</h1>
      //       {/* 답변들 div */}
      //       <div className="mt-3 px-20 flex items-center justify-between">
      //         {/* content 이 부분은 한번에렌더링 할거긴 함 */}
      //         <AnswerList answerList={answerList} />
      //       </div>
      //     </div>
      //     {/* mbti별 인기 답변 */}
      //     <div className=" bg-neutral-200 w-full p-5 text-black">
      //       MBTI별 인기 답변
      //       <div className="mt-3 grid grid-cols-4 gap-4">
      //         {answer.map((item) => (
      //           <SmallAnswer key={item.id} answer={item} />
      //         ))}
      //       </div>
      //     </div>
      //     <Link
      //       href="/compare"
      //       className="inline-block text-2xl font-bold p-5 text-center bg-gray-400 text-white rounded-full mt-5"
      //     >
      //       MBTI 별로 비교
      //     </Link>
      //   </>
      // )
      (
        <>
          <div className="flex flex-row">
            <div className="basis-1/4 flex flex-col items-center">
              <div className="bg-neutral-100 basis-1/2">
                오늘의 질문
              </div>
              <div className="basis-1/2 border-none flex items-center">
                <MbtiButton />
              </div>
            </div>
            <div className="basis-3/4 mt-3 px-20 flex flex-col items-center">
              {/* content 이 부분은 한번에 렌더링 할거긴 함 */}
              <AnswerList answerList={answerList} />
              {/* 임시 */}
              <div className="m-3 bg-neutral-200">이런저런</div>
              <div className="m-3 bg-neutral-200">이런저런</div>
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
