import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
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

  const questionCollection = collection(db, "questions");
  const answerCollection = collection(db, "answers");

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const [bgColor, setBgColor] = useState('lime-500');

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
        const q = query(answerCollection, where('userId', '==', userId));
        const answerSnapshot = await getDocs(q);
        const dates = answerSnapshot.docs.map((doc) => parseISO(doc.data().date));
        setUserAnswerDates(dates);
      };

      fetchUserAnswerDates();
    }
  }, [session]);

  const isAnsweredDate = (date) => {
    return userAnswerDates.some((answeredDate) => isSameDay(answeredDate, date));
  };

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const calendarCells = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    calendarCells.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">달력</h1>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="md:w-2/4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex justify-between mb-4">
              <div>
                <button
                  className={`bg-${bgColor} hover:bg-${bgColor}-600 text-white px-1 py-1 rounded-lg`}
                  onClick={prevMonth}
                  style={{ backgroundColor: bgColor }}
                >
                  {'<'}
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">
                  {format(currentMonth, 'yyyy년 MM월')}
                </h2>
              </div>
              <div>
                <button
                  className={`bg-${bgColor} hover:bg-${bgColor}-600 text-white px-1 py-1 rounded-lg`}
                  onClick={nextMonth}
                  style={{ backgroundColor: bgColor }}
                >
                  {'>'}
                </button>
              </div>
            </div>
            <div className="h-2/3 w-full">
              <div className="flex items-center">
                <div className="w-full">
                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((day) => {
                      const isSelected = isSameDay(day, selectedDate);
                      const isHovered = isSameDay(day, hoveredDate);
                      const isCurrentMonth = isSameMonth(day, currentMonth);
                      const isAnswered = isAnsweredDate(day);
                      const cellClassName = `flex group hover:bg-blue-100 hover:shadow-lg hover-light-shadow rounded-lg mx-1 transition-all duration-300 cursor-pointer justify-center w-10 h-10 ${
                        isCurrentMonth ? '' : 'text-gray-400 pointer-events-none'
                      } ${isSelected ? 'bg-lime-300 shadow-lg light-shadow' : ''}`;

                      return (
                        <div
                          key={day.toISOString().split('T')[0]}
                          className={cellClassName}
                          onClick={() => onDateClick(day)}
                          onMouseEnter={() => setHoveredDate(day)}
                        >
                          <span className="flex h-2 w-2 absolute -top-1 -right-1">
                            <span className="animate-ping absolute group-hover:animate-none h-2 w-2 rounded-full bg-lime-500 opacity-75" />
                            <span
                              className={`relative inline-flex rounded-full h-2 w-2 bg-lime-500 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          </span>
                          <span className="flex items-center">
                            {format(day, 'd')}
                            {isAnswered && (
                              <span className="text-xs text-white bg-blue-500 rounded-full px-1 ml-1">
                                ✓
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-3/4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold mb-4">나의 답변</h2>
            {showQuestion && (
              <div className="w-full mx-auto ml-2">
                {userAnswer !== '' ? (
                  <MyAnswer questionDate={selectedDate} answer={userAnswer} />
                ) : (
                  <p className="text-gray-500">답변이 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;
