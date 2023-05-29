import Layout from "@/components/Layout";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { questions } from "@/data";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

const WeeklyCalendar = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
  const calendarDays = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    calendarDays.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return (
    <div className="flex justify-center">
      {calendarDays.map((day) => (
        <div
          key={day}
          className="flex items-center justify-center w-16 h-16 border border-gray-300"
        >
          <span className="text-sm font-medium">
            {format(day, "EEE")}
          </span>
          <span className="text-lg font-bold">
            {format(day, "d")}
          </span>
        </div>
      ))}
    </div>
  );
};

const Mypage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

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
        
        {/* 주간 캘린더 */}
        <WeeklyCalendar />

        {/* 날짜별 질문과 답변 */}
        {questions.map((question) => (
          <div key={question.id} className="mt-4">
            <h2 className="text-2xl font-bold">{question.question}</h2>
            <p className="text-gray-500">{question.askDate}</p>
            {/* 답변을 보여주는 로직을 구현해주세요 */}
          </div>
        ))}

        <div className="my-8">
          <h2 className="text-3xl font-bold mb-4">좋아요를 표시한 답변</h2>
          {/* 여기다 좋아요 답변 로직 추가할 예정입니다! */}
        </div>
      </main>
    </Layout>
  );
};

export default Mypage;
