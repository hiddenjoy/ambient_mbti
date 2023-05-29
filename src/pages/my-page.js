import Layout from "@/components/Layout";
import { format, addDays, startOfWeek, endOfWeek, subWeeks, addWeeks } from "date-fns";
import { questions } from "@/data";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

const WeeklyCalendar = ({ handleDatePopup }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); // 기본값으로 현재 날짜 사용
  const startDate = currentWeekStart; // startDate 변수를 currentWeekStart 뒤에 선언

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prevWeekStart) => subWeeks(prevWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prevWeekStart) => addWeeks(prevWeekStart, 1));
  };

  const endDate = endOfWeek(currentWeekStart);
  const calendarDays = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    calendarDays.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null); // 마우스 커서 위치 날짜 상태 추가

  const handleDateClick = (date) => {
    setSelectedDate(date);
    handleDatePopup(date);
  };

  const handleCursorMove = (index) => {
    const newWeekStart = addDays(currentWeekStart, index - 3);
    setCurrentWeekStart(newWeekStart);
  };

  const handleDateHover = (date) => {
    setHoveredDate(date);
  };

  return (
    <div className="flex justify-center">
      {calendarDays.map((day, index) => (
        <div
          key={day}
          className={`flex flex-col items-center justify-center w-40 h-40 border ${
            selectedDate === day ? "bg-blue-200" : hoveredDate === day ? "bg-blue-100" : "border-gray-300"
          }`}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => handleCursorMove(index)}
          onMouseOver={() => handleDateHover(day)} // 마우스 커서 위치 감지
          onMouseLeave={() => handleDateHover(null)} // 마우스 커서가 벗어날 때 상태 초기화
        >
          <span className="text-sm font-medium">{format(day, "EEE")}</span>
          <span className="text-lg font-bold">{format(day, "d")}</span>
        </div>
      ))}
    </div>
  );
};

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
              <p className="text-lg">질문: 어쩌구 저쩌구</p>
              <p className="text-lg">답변: 저쩌구 어쩌구</p>
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
          <h2 className="text-3xl font-bold mb-4">날짜별 질문과 답변</h2>
          <div className="overflow-y-auto h-60 border border-gray-500">
          {/* 날짜별 질문과 답변을 렌더링하는 로직 */}
          {questions.map((question) => (
          <div key={question.id} className="mt-4">
            <h2 className="text-2xl font-bold">{question.question}</h2>
            <p className="text-gray-500">{question.askDate}</p>
            {/* 답변을 보여주는 로직 */}
            {questionAnswers && questionAnswers.map((qa) => {
              if (qa.questionId === question.id) {
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

            </div>
        </div>

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