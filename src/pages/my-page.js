import Layout from "@/components/Layout";
import { format, addDays, startOfWeek, endOfWeek, subWeeks, addWeeks } from "date-fns";
import { questions } from "@/data";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

const UserProfile = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="p-8 bg-blue-200 mb-8 flex flex-row">
      <div className="flex items-center mr-4">
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-bold">{user.name}</h2>
        <p className="text-lg">MBTI: {user.mbti}</p>
      </div>
    </div>
  );
};

const WeeklyCalendar = ({ handleDatePopup }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const startDate = currentWeekStart;
  const endDate = endOfWeek(currentWeekStart);
  const calendarDays = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    calendarDays.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
    handleDatePopup(date);
  };

  const handleCursorMove = (day) => {
    const index = calendarDays.findIndex((date) => date === day);
    if (index !== -1) {
      const newWeekStart = addDays(currentWeekStart, index - 3);
      setCurrentWeekStart(newWeekStart);
      setTimeout(() => {
        setCurrentWeekStart(newWeekStart);
      }, 300);
    }
  };
  
  

  const handleDateHover = (date) => {
    setHoveredDate(date);
  };

  const weeks = [];
let week = [];

while (calendarDays.length > 0) {
  week.push(calendarDays.shift());

  if (week.length === 7) {
    weeks.push(week);
    week = [];
  }
}

// 나머지 남은 일자가 있는 경우 마지막 주에 추가
if (week.length > 0) {
  weeks.push(week);
}

return (
  // ...
  <div className="flex justify-center">
    {/* 이전 주로 이동하는 버튼 */}
    <button className="text-2xl font-bold bg-blue-300 text-white rounded" onClick={goToPreviousWeek}>
      &lt;
    </button>

    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold mb-2">
        {format(currentWeekStart, "yyyy년")} {format(currentWeekStart, "MMM")}
      </span>

      <div className="flex justify-center">
        {/* 주간 캘린더 */}
        {weeks.map((week) => (
          <div className="flex" key={week[0]}>
            {week.map((day) => (
              <div
                key={day}
                className={`flex flex-col items-center justify-center w-40 h-40 border ${
                  selectedDate === day ? "bg-blue-200" : hoveredDate === day ? "bg-blue-100" : "border-gray-300"
                }`}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => handleCursorMove(day)}
                onMouseOver={() => handleDateHover(day)}
                onMouseLeave={() => handleDateHover(null)}
              >
                <span className="text-sm font-medium">{format(day, "EEE")}</span>
                <span className="text-lg font-bold">{format(day, "d")}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* 다음 주로 이동하는 버튼 */}
    <button className="text-2xl font-bold bg-blue-300 text-white rounded" onClick={goToNextWeek}>
      &gt;
    </button>
  </div>
);
 }

 const Mypage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [likedAnswers, setLikedAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (session && session.user) {
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

  const handleDatePopup = (date) => {
    setPopupDate(date);
  };

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">Mypage</h1>
        
        <UserProfile user={user} /> {/* 프로필 영역 추가 */}
        {/* 주간 캘린더 */}
        <WeeklyCalendar handleDatePopup={handleDatePopup} />

        {/* 팝업 */}
        {popupDate && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4">
              <h2 className="text-lg font-bold mb-2">
                {format(popupDate, "yyyy년 MM월 dd일")}
              </h2>
              {/* 팝업 내용을 구현해야함*/}
              {/* 질문 답변 데이터 끌어올 예정 */}
              {questions.map((question) => (
                <div key={question.id} className="mt-4">
                  <h2 className="text-2xl font-bold">{question.question}</h2>
                  <p className="text-gray-500">{question.askDate}</p>
                  {/* 답변을 보여주는 로직 */}
                  {questionAnswers && questionAnswers.map((qa) => {
                    if (qa.askDate === format(popupDate, "yyyy-MM-dd")) {
                      return (
                        <div key={qa.id} className="mb-4">
                          <p className="text-lg font-semibold mb-2">{qa.askDate}</p>
                          <p className="text-lg">질문: {qa.question}</p>
                          <p className="text-lg">답변: {qa.answer}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
              <button
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={() => setPopupDate(null)} // 팝업 닫기
              >
                닫기
              </button>
            </div>
          </div>
        )}

      

        <div className="my-8">
          <h2 className="text-3xl font-bold mb-4">좋아요를 표시한 답변</h2> 
          <div className="overflow-y-auto h-60 border border-gray-500">
          {likedAnswers.map((answer) => (
            <div key={answer.id} className="mb-4">
              <p className="text-lg font-semibold mb-2">{answer.askDate}</p>
              <p className="text-lg">질문: {answer.question}</p>
              <p className="text-lg">답변: {answer.answer}</p>
            </div>
          ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Mypage;