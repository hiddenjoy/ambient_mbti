import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/index.js';
import AnswerList from '@/components/AnswerList.js';
import mbtiColors from '@/data/mbtiColors';

const MyAnswer = ({ userId, selectedDate, handleDatePopup }) => {
  const { data: session } = useSession();
  const [userAnswerDates, setUserAnswerDates] = useState(null);

  useEffect(() => {
    if (session) {
      // 유저가 질문에 답변한 날짜 가져오기
      const fetchUserAnswerDates = async () => {
        const q = query(collection(db, 'answers'), where('userId', '==', userId));
        const answerSnapshot = await getDocs(q);
        const dates = answerSnapshot.docs.map((doc) => parseISO(doc.data().date));
        setUserAnswerDates(dates);
      };

      fetchUserAnswerDates();
    }
  }, [session]);

  return (
    <div className="w-1/2">
      <div className="mb-2">
        {/* 답변이 없을 경우 */}
        {!selectedDate && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-gray-500 text-center">
            <p>질문을 보려면 날짜를 선택하세요.</p>
          </div>
        )}

        {/* 답변이 있는 경우 */}
        {selectedDate && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{format(selectedDate, 'yyyy년 MM월 dd일')}</h3>
            <AnswerList
              userId={userId}
              selectedDate={selectedDate}
              handleDatePopup={handleDatePopup}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnswer;
