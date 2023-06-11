// pages/admin/question.js
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import { useRouter } from "next/router";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '@/styles/Calendar.module.css';
import QuestionForAdminPage from "@/components/QuestionForAdminPage";

export default function AdminQuestion() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      const questionsCollection = collection(db, "questions");
      const questionSnapshot = await getDocs(query(questionsCollection, orderBy("date", "desc")));
      const questionsArray = questionSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date,
          content: data.content,
        };
      });
      setQuestions(questionsArray);
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const foundQuestion = questions.find(question => question.date === selectedDate);
      setCurrentQuestion(foundQuestion || null);
    }
  }, [selectedDate, questions]);

  async function handleAddQuestion() {
    try {
      const docRef = await addDoc(collection(db, "questions"), {
        date: selectedDate,
        content: "질문을 입력하세요."
      });
      const newQuestion = {
        id: docRef.id,
        date: selectedDate,
        content: "질문을 입력하세요."
      };
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
      setCurrentQuestion(newQuestion);
    } catch (error) {
      console.error("Error adding question: ", error);
    }
  }

  function handleQuestionUpdate(questionDate, updatedContent) {
    setQuestions(prevQuestions => prevQuestions.map(question => 
      question.date === questionDate ? { ...question, content: updatedContent } : question
    ));
  }

  return (
    <div className="flex justify-center h-screen p-4 m-8">
      <div className="w-1/12 p-4 ml-4">
        <button
          onClick={() => router.push("/admin/admin")}
          className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded mb-4 block text-left text-xl"
          style={{width: '200px'}}
        >
          Users
        </button>
        <button
          onClick={() => router.push("/admin/question")}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 block text-left text-xl"
          style={{width: '200px'}}
        >
          Questions
        </button>
      </div>
      <div className="w-3/4 bg-white rounded-lg shadow p-4 ml-4">
        <div className="flex">
          <div className={`${styles.reactCalendar} w-1/2 p-4`}>
            <h2 className="text-2xl mb-4">날짜</h2>
            <div className={`${styles.calendarWrapper}`}>
              <Calendar
                locale="ko-KR"
                value={selectedDate ? new Date(selectedDate) : new Date()}
                onClickDay={date => {
                  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                  setSelectedDate(localDate.toISOString().split('T')[0]);
                }}
                tileClassName={({ date, view }) => {
                  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                  const dateString = localDate.toISOString().split('T')[0];
                  const questionExists = !!questions.find((q) => q.date === dateString); 
                  return questionExists ? styles.calendarDayQuestionExists : styles.calendarDayQuestionNotExists;
                }}
              />
            </div>
          </div>
          <div className="w-1/2 p-4">
            <h2 className="text-2xl mb-4">질문</h2>
            {currentQuestion ? (
              <QuestionForAdminPage
                key={currentQuestion.id}
                question={currentQuestion}
                onQuestionUpdate={handleQuestionUpdate}
              />
            ) : (
              selectedDate && (
                <div>
                  <p>질문을 추가하시겠습니까?</p>
                  <div className="flex">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mr-2"
                      onClick={handleAddQuestion}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
                      onClick={() => setSelectedDate(null)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}