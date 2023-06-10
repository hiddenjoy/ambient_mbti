import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import { collection, doc, query, where, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/index.js';
import AnswerList from '@/components/AnswerList.js';
import Question from '@/components/Question';
import mbtiColors from '@/data/mbtiColors';
import MyAnswer from '@/components/MyAnswer';

const UserCalendar = ({ handleDatePopup }) => {
  const { data: session } = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [userAnswerDates, setUserAnswerDates] = useState([]);

  const questionCollection = collection(db, 'questions');
  const answerCollection = collection(db, "answers");

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const [bgColor, setBgColor] = useState("lime-500");

  const onDateClick = async (day) => {
    setSelectedDate(day);
    setHoveredDate(day);
    setShowQuestion(true);

    if (session) {
      const userId = session.user.id;
      const questionDate = format(day, 'yyyy-MM-dd');

      const q = query(questionCollection, where('date', '==', questionDate), where('userId', '==', userId));
      const questionSnapshot = await getDocs(q);

      if (questionSnapshot.size > 0) {
        setUserAnswer(questionSnapshot.docs[0].data().content);
      } else {
        setUserAnswer('질문이 없습니다.');
      }
    }
  };

  useEffect(() => {
    if (session) {
      // 유저가 질문에 답변한 날짜 가져오기
      const userId = session.user.id;

      const fetchUserAnswerDates = async () => {
        const q = query(collection(db, 'answers'), where('userId', '==', userId));
        const answerSnapshot = await getDocs(q);
        const dates = answerSnapshot.docs.map((doc) => parseISO(doc.data().date));
        setUserAnswerDates(dates);
      };

      fetchUserAnswerDates();
    }
  }, [session]);

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const calendarCells = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    calendarCells.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return (
    <div className="flex mt-10">
      <div className="flex-1 mx-auto">
        <div className="flex items-stretch h-full">
          <div className="w-1/3 mx-auto">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex justify-between mb-4">
                <div>
                  <button className="bg-lime-500 hover:bg-lime-600 text-white px-1 py-1 rounded-lg" onClick={prevMonth} style={{ backgroundColor: bgColor }}>
                    {'<'}
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">
                    {format(currentMonth, 'yyyy년 MM월')}
                  </h2>
                </div>
                <div>
                  <button className="bg-lime-500 hover:bg-lime-600 text-white px-1 py-1 rounded-lg" onClick={nextMonth} style={{ backgroundColor: bgColor }}>
                    {'>'}
                  </button>
                </div>
              </div>
              <div className="h-2/3 w-full">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((day) => (
                        <div
                          key={day.toISOString().split('T')[0]}
                          className={`flex group hover:bg-lime-100 hover:shadow-lg hover-light-shadow rounded-lg mx-1 transition-all duration-300 cursor-pointer justify-center w-10 h-10 ${
                            isSameMonth(day, currentMonth)
                              ? ''
                              : 'text-gray-400 pointer-events-none'
                          } ${
                            isSameDay(day, selectedDate)
                              ? 'bg-lime-300 shadow-lg light-shadow'
                              : ''
                          } ${
                            userAnswerDates.includes(+day)
                              ? `bg-${mbtiColors[session.user.mbti]}`
                              : ''
                          }`}
                          onClick={() => onDateClick(day)}
                          onMouseEnter={() => setHoveredDate(day)}
                        >
                          <span className="flex h-2 w-2 absolute -top-1 -right-1">
                            <span className="animate-ping absolute group-hover:animate-none h-2 w-2 rounded-full bg-lime-500 opacity-75" />
                            <span className={`relative inline-flex rounded-full h-2 w-2 bg-lime-500 ${isSameDay(day, hoveredDate) ? 'opacity-100' : 'opacity-0'}`} />
                          </span>
                          <span className="flex items-center">{format(day, 'd')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {session && (
            <>
              <div className="w-1/3 mx-auto ml-4">
                <div className="mb-4">
                  <MyAnswer userId={session.user.id} selectedDate={selectedDate} handleDatePopup={handleDatePopup} />
                </div>
              </div>
              <div className="w-1/3 mx-auto ml-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-2">나의 답변</h3>
                  <p>{userAnswer}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;
