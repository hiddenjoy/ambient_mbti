import { format, addDays, startOfWeek, endOfWeek, subWeeks, addWeeks } from "date-fns";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import AnswerList from "@/components/AnswerList.js"; // AnswerList를 가져옵니다.
import Question from "@/components/Question";

const UserCalendar = ({ handleDatePopup }) => {
  const { data: session } = useSession();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);

  const questionCollection = collection(db, "questions");

  useEffect(() => {
    async function fetchUserAnswer() {
      if (session && selectedDate) {
        const userId = session.user.id;
        const questionDate = selectedDate.toISOString().split("T")[0];

        const q = query(
          questionCollection,
          where("date", "==", questionDate)
        );
        const questionSnapshot = await getDocs(q);

        if (questionSnapshot.size > 0) {
          setUserAnswer(questionSnapshot.docs[0].data().content);
        } else {
          setUserAnswer("질문이 없습니다.");
        }
      }
    }

    fetchUserAnswer();
  }, [session, selectedDate]);

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
     // 선택한 날짜에 대한 질문을 표시하도록 상태 변경
     setShowQuestion(true);
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
    <div className="flex flex-col h-full">
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
                  className={`flex flex-col items-center justify-center w-20 h-20 border ${
                    selectedDate === day
                      ? "bg-blue-200"
                      : hoveredDate === day
                      ? "bg-blue-100"
                      : "border-gray-300"
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
      <div className="flex justify-between"> 
      {/* 이전 주로 이동하는 버튼 */}
  <button
    className="text-2xl font-bold bg-blue-300 text-white rounded h-1/2"
    onClick={goToPreviousWeek}
  >
    &lt;
  </button>
  <button
          className="text-2xl font-bold bg-blue-300 text-white rounded h-1/2"
          onClick={goToNextWeek}
        >
          &gt;
    </button>
    </div>
     {selectedDate && selectedDate.toISOString().split("T")[0] === hoveredDate?.toISOString().split("T")[0] && (
        <div className="question-container">
          <Question 
          isAnsweredToday={true}
          currentDate={selectedDate}
          setCurrentDate={setSelectedDate}
      />
      <p className="question">{userAnswer}</p>
        </div>)}
    </div>
  );
};

export default UserCalendar;
