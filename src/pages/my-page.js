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
  
  const representativeQuestion = "나를 대표하는 질문";
  const answer = "질문에 대한 답변";

  return (
    <div className="p-8 bg-blue-200 mb-8">
      <div className="flex items-center mb-4">
        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
        <h2 className="text-lg font-bold">{user.name}</h2>
      </div>
      <div>
        <h3 className="text-xl font-bold">나를 대표하는 질문</h3>
        {/* 질문과 답변을 여기에 표시 */}
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
    <div className="flex justify-center">
      <button className="text-2xl font-bold bg-blue-300 text-white rounded" onClick={goToPreviousWeek}>
        &lt;
      </button>
      <div className="flex flex-col">
        {weeks.map((week, index) => (
          <div key={index} className="flex">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-16 h-16 flex items-center justify-center cursor-pointer ${
                  selectedDate && format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                    ? "bg-blue-400 text-white"
                    : hoveredDate && format(hoveredDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                    ? "bg-blue-200"
                    : ""
                }`}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => handleDateHover(day)}
                onMouseMove={() => handleCursorMove(day)}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="text-2xl font-bold bg-blue-300 text-white rounded" onClick={goToNextWeek}>
        &gt;
      </button>
    </div>
  );
};

const Home = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          // 사용자 정보 가져오기
          const user = userDoc.data();
          console.log("사용자 정보:", user);
        }
      }
    };

    fetchData();
  }, [session]);

  return (
    <Layout>
      <div className="container mx-auto px-4 grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <h1 className="text-2xl font-bold mt-8 mb-4">프로필</h1>
          <UserProfile user={session?.user} />
        </div>
        <div className="col-span-3">
          <h1 className="text-2xl font-bold mt-8 mb-4">주간 캘린더</h1>
          <WeeklyCalendar handleDatePopup={(date) => console.log("선택한 날짜:", date)} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
