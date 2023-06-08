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
    setHoveredDate(date);
    setShowQuestion(true);
  };

  const handleCursorMove = (day) => {
    const index = calendarDays.findIndex((date) => date === day);
    if (index !== -1) {
      const newIndex = index - 3;
      if (newIndex >= 0 && newIndex < calendarDays.length) {
        const newWeekStart = addDays(currentWeekStart, newIndex);
        setCurrentWeekStart(newWeekStart);
      }
    }
  };

  const handleDateHover = (date) => {
    if (selectedDate && date && date.toISOString().split("T")[0] === selectedDate.toISOString().split("T")[0]) {
      setHoveredDate(date);
    } else {
      setHoveredDate(null);
    }
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

  if (week.length > 0) {
    weeks.push(week);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <button
          className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg"
          onClick={goToPreviousWeek}
        >
          {"<"}
        </button>
        <div className="flex-1 justify-center">
          <div className="grid grid-cols-7 gap-1">
            {weeks.map((week, index) => (
              <div key={index} className="flex">
                {week.map((day) => (
                  <div
                    key={day.toISOString().split("T")[0]}
                    className={`flex group hover:bg-lime-100 hover:shadow-lg hover-light-shadow rounded-lg mx-1 transition-all duration-300 cursor-pointer justify-center w-16 ${
                      day.toISOString().split("T")[0] === selectedDate?.toISOString().split("T")[0] ? "bg-lime-300 shadow-lg light-shadow" : ""
                    }`}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => handleDateHover(day)}
                  >
                    <span className="flex h-3 w-3 absolute -top-1 -right-1">
                      <span className="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-lime-400"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                    </span>
                    <div className="flex items-center px-4 py-4">
                      <div className="text-center">
                        <p
                          className={`text-gray-900 group-hover:text-purple-900 text-sm transition-all duration-300 ${
                            day.toISOString().split("T")[0] === selectedDate?.toISOString().split("T")[0] ? "" : "text-gray-900"
                          }`}
                        >
                          {format(day, "E")}
                        </p>
                        <p
                          className={`text-gray-900 group-hover:text-purple-900 mt-3 group-hover:font-bold transition-all duration-300 ${
                            day.toISOString().split("T")[0] === selectedDate?.toISOString().split("T")[0] ? "" : "text-gray-900"
                          }`}
                        >
                          {format(day, "d")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg"
          onClick={goToNextWeek}
        >
          {">"}
        </button>
      </div>
      {selectedDate && selectedDate.toISOString().split("T")[0] === hoveredDate?.toISOString().split("T")[0] && (
        <div className="question-container">
          <Question isAnsweredToday={true} currentDate={selectedDate} setCurrentDate={setSelectedDate} />
          <p className="question">{userAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default UserCalendar;
