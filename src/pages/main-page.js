import Link from "next/link";
import { questions } from "@/data";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

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
        {/* 질문 */}
        <div className="bg-neutral-300 w-full flex flex-col items-center p-5 text-black">
  <div className="w-3xl p-5 bg-lime-100 rounded-3xl">
    <h1 className="text-xl font-bold mb-3">오늘의 질문</h1>
    <p className="text-center">
      {user?.name}님이 가장 '나'다워지는 순간은 언제인가요?
    </p>
    <div className="flex space-x-3 mt-3">
      <input
        className="flex-grow p-2 border-2 border-neutral-400 rounded-lg"
        placeholder="답변을 입력해주세요"
      />
<button type="submit" className="p-2 rounded-lg bg-gray-400">
  제출
</button>
    </div>
  </div>
</div>
        {/* 랜덤한 답변 보여주기 */}
        <div className="bg-white w-full p-5 text-black">
          <h1>{user?.mbti} 친구들의 답변 모아보기</h1>
          {/* 답변들 div */}
          <div className="mt-3 px-20 flex items-center justify-between">
            {/* content 이 부분은 한번에렌더링 할거긴 함 */}
            <div className="border-lime-200 border-2 rounded-lg p-2">이런저런</div>
            <div className="border-lime-200 border-2 rounded-lg p-2">이런저런</div>
            <div className="border-lime-200 border-2 rounded-lg p-2">이런저런</div>
          </div>
        </div>
        {/* mbti별 인기 답변 */}
        <div className=" bg-neutral-200 w-full p-5 text-black">
          MBTI별 인기 답변
          <div className="mt-3 grid grid-cols-4 gap-1">
            <div className="bg-lime-100 rounded-lg p-2 ">01</div>
            <div className="bg-lime-100 rounded-lg p-2">02</div>
            <div className="bg-lime-100 rounded-lg p-2">03</div>
            <div className="bg-lime-100 rounded-lg p-2">04</div>
            <div className="bg-lime-100 rounded-lg p-2">05</div>
            <div className="bg-lime-100 rounded-lg p-2">06</div>
            <div className="bg-lime-100 rounded-lg p-2">07</div>
            <div className="bg-lime-100 rounded-lg p-2">08</div>
            <div className="bg-lime-100 rounded-lg p-2">09</div>
            <div className="bg-lime-100 rounded-lg p-2">10</div>
            <div className="bg-lime-100 rounded-lg p-2">11</div>
            <div className="bg-lime-100 rounded-lg p-2">12</div>
            <div className="bg-lime-100 rounded-lg p-2">13</div>
            <div className="bg-lime-100 rounded-lg p-2">14</div>
            <div className="bg-lime-100 rounded-lg p-2">15</div>
            <div className="bg-lime-100 rounded-lg p-2">16</div>
          </div>
        </div>
        <Link
  href="/compare"
  className="inline-block text-2xl font-bold p-5 text-center bg-gray-400 text-white rounded-full mt-5"
>
  MBTI 별로 비교
</Link>
      </main>
    </>
  );
};
export default Main;
