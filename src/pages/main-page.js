import Link from "next/link";
import { questions } from "@/data";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import Question from "../components/Question";
import SmallAnswer from "../components/SmallAnswer";
import { answer } from "@/data/answer.js";

const Main = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    }

    fetchUser();
  }, [session]);

  return (
    <>
      {console.log(user)}
      <main className="flex min-h-screen flex-col items-center divide-y divide-slate-700">
        <Question />
        {/* 랜덤한 답변 보여주기 */}
        <div className="bg-white w-full p-5 text-black">
          <h1>{user?.mbti} 친구들의 답변 모아보기</h1>
          {/* 답변들 div */}
          <div className="mt-3 px-20 flex items-center justify-between">
            {/* content 이 부분은 한번에렌더링 할거긴 함 */}
            <div className="bg-lime-100">이런저런</div>
            <div className="bg-lime-100">이런저런</div>
            <div className="bg-lime-100">이런저런</div>
          </div>
        </div>
        {/* mbti별 인기 답변 */}
        <div className=" bg-neutral-200 w-full p-5 text-black">
          MBTI별 인기 답변
          <div className="mt-3 grid grid-cols-4 gap-4">
            {answer.map((item) => (
              <SmallAnswer answer={item} />
            ))}
          </div>
        </div>
        <Link
          href="/compare"
          className="w-full text-2xl font-bold  p-5 text-center text-secondary"
        >
          MBTI 별로 비교
        </Link>
      </main>
    </>
  );
};
export default Main;
