import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

export default function Mypage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setQuestionAnswers(userDoc.data().questionAnswers);
        }
      }
    }

    fetchUser();
  }, [session]);

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-6xl font-bold text-center text-primary">Mypage</h1>

        <div className="my-8">
          <h2 className="text-3xl font-bold mb-4">날짜별 질문과 답변</h2>
          {questionAnswers &&
            questionAnswers.map((qa) => (
              <div key={qa.id} className="mb-4">
                <p className="text-lg font-semibold mb-2">{qa.askDate}</p>
                <p className="text-lg">질문: {qa.question}</p>
                <p className="text-lg">답변: {qa.answer}</p>
              </div>
            ))}
        </div>

        <div className="my-8">
          <h2 className="text-3xl font-bold mb-4">좋아요를 표시한 답변</h2>
          {/* 여기다 좋아요 답변 로직 추가할 예정입니다! */}
        </div>
      </main>
    </Layout>
  );
}
