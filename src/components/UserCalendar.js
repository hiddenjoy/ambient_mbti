import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import { collection, doc, query, where, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/index.js';
import AnswerList from '@/components/AnswerList.js';
import Question from '@/components/Question';
import mbtiColors from '@/data/mbtiColors';
import MyAnswer from '@/components/MyAnswer';
import CellAnswers from '@/components/CellAnswers';

const UserCalendar = ({ handleDatePopup }) => {
  const { data: session } = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [userAnswerDates, setUserAnswerDates] = useState([]);
  const [showAllAnswers, setShowAllAnswers] = useState(true);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState(null);

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
    if (isSameDay(day, selectedDate)) {
      setSelectedDate(null);
      setShowQuestion(false);
      setUserAnswer('');
      return;
    }

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
    async function fetchUser() {
      if (session && session.user) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserId(userRef.id);
          setUser(userDoc.data());
          setQuestionAnswers(userDoc.data().questionAnswers);

          const userMbti = userDoc.data().mbti;
          const mbtiColor = mbtiColors[userMbti];

          if (mbtiColor) {
            setBgColor(mbtiColor);
          }
        }
      }
    }

    async function fetchUserAnswerDates() {
      if (session && session.user) {
        const userId = session.user.id;

        const q = query(answerCollection, where('userId', '==', userId));
        const answerSnapshot = await getDocs(q);

        const dates = answerSnapshot.docs.map(doc => format(parseISO(doc.data().date), 'd'));
        setUserAnswerDates(dates);
      }
    }

    fetchUser();
    fetchUserAnswerDates();
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
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-4">
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="md:w-2/4">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex justify-between mb-3">
              <div>
                <button
                  className="bg-lime-500 hover:bg-lime-600 text-white px-1 py-1 rounded-lg"
                  onClick={prevMonth}
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
                  className="bg-lime-500 hover:bg-lime-600 text-white px-1 py-1 rounded-lg"
                  onClick={nextMonth}
                >
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
                            ? 'border border-lime-500'
                            : ''
                        }`}
                        onClick={() => onDateClick(day)}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                      >
                        <div className="relative">
                          {session && (
                            <div className="absolute bottom-0 right-0">
                              {isSameDay(day, hoveredDate) && (
                                <img
                                  className="w-10 h-10"
                                  src={`/images/MBTIcharacters/${session.user.mbti}.png`}
                                  alt={`${session.user.mbti} character`}
                                />
                              )}
                              {userAnswerDates.includes(format(day, 'd')) && (
                                <img
                                  className="w-10 h-10"
                                  src={`/images/MBTIcharacters/${session.user.mbti}.png`}
                                  alt={`${session.user.mbti} character`}
                                />
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-center w-full h-full">
                            <span>{format(day, 'd')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-2/4">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="mb-4">
            <h2 className="text-xl font-bold">나의 답변</h2>
              {selectedDate ? (
                <CellAnswers selectedDate={selectedDate} />
              ) : (
                session && (
                  <MyAnswer
                    selectedDate={selectedDate}
                    handleDatePopup={handleDatePopup}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;
