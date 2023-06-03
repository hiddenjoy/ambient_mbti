import { questions } from "@/data";
import React, { useState, useEffect } from "react";
import SmallAnswerList from "@/components/SmallAnswerList";
import { useSession, signOut } from "next-auth/react";

import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";

const Question = ({ isAnsweredToday, currentDate, setCurrentDate }) => {
  const answerCollection = collection(db, "answers");
  const userCollection = collection(db, "users");
  const questionCollection = collection(db, "questions");

  const { data } = useSession();
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (data && data.user) {
        const userRef = doc(db, "users", data.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    }

    fetchUser();
  }, [data]);

  const getQuestion = async () => {
    const q = query(
      questionCollection,
      where("date", "==", currentDate.toISOString().split("T")[0])
    );
    const results = await getDocs(q);

    setQuestion(results.docs[0].data());
  };

  const getAnswer = async () => {
    if (data) {
      const userId = data.user.id;

      const q = query(
        answerCollection,
        where("questionDate", "==", currentDate.toISOString().split("T")[0]),
        where("user.id", "==", userId)
      );

      const results = await getDocs(q);

      if (results.docs.length > 0) {
        setAnswer(results.docs[0].data().content);
      } else {
        setAnswer("답변이 없어요 ㅠㅠ");
      }
    }
  };

  const goPrevious = async () => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);

    setCurrentDate(previousDate);
  };

  const goNext = async () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    setCurrentDate(nextDate);
  };

  useEffect(() => {
    getQuestion();
    getAnswer();
  }, []);

  useEffect(() => {
    getQuestion();
    getAnswer();
  }, [currentDate]);

  const addAnswer = async () => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "") return;
    const userId = data.user.id;
    const today = new Date().toISOString().split("T")[0];

    const docRef = await addDoc(answerCollection, {
      user: { id: userId, mbti: user?.mbti },
      likeUsers: [],
      content: input,
      questionDate: today,
    });

    location.reload();
    setInput("");
  };

  const updateAnswer = async () => {
    if (answer.trim() === "") return;
    if (data) {
      const userId = data.user.id;

      const q = query(
        answerCollection,
        where("questionDate", "==", currentDate.toISOString().split("T")[0]),
        where("user.id", "==", userId)
      );

      const results = await getDocs(q);

      if (results.docs.length > 0) {
        const docId = results.docs[0].id;
        const answerRef = doc(db, "answers", docId);

        await updateDoc(answerRef, {
          content: answer,
        });
      }
    }
    handleIsEdit();
  };

  const handleIsEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <div className="w-full p-5 h-full">
      {isAnsweredToday ? (
        <>
          <div className="text-center text-xl font-bold">오늘의 질문</div>
          <div className="flex flex-row items-center justify-center mb-3">
            <div className="text-xs text-gray-600 text-center whitespace-normal">
              {question.date}
            </div>
          </div>
          <p className="text-center border my-5 text-xl">
            " {question.content} "
          </p>
          <div className="flex text-sm text-gray-600">나의 답변:</div>

          <div className="flex flex-col bg-gray-600 p-5 items-center">
            {isEdit ? (
              <>
                <input
                  className="w-full p-2 border-2 border-neutral-400 rounded-lg"
                  placeholder="답변을 입력해주세요"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <div className="flex flex-row justify-center text-xs w-full">
                  <button
                    onClick={handleIsEdit}
                    className="w-1/4 p-2 mt-3 mx-2 border-2"
                  >
                    취소
                  </button>
                  <button
                    onClick={updateAnswer}
                    className="w-1/4 p-2 mt-3 border-2"
                  >
                    완료
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full p-2 text-white text-xl text-center whitespace-normal">
                  {answer}
                </div>
                <button
                  onClick={handleIsEdit}
                  className="w-1/4 mt-3 p-2 border-2 bg-gray-200 text-xs items-center"
                >
                  수정
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-center text-3xl font-bold">오늘의 질문</div>
          <div className="text-sm text-gray-600 mb-10 text-center whitespace-normal">
            {question.date}
          </div>
          <p className="text-center border my-10 p-10 text-4xl">
            " {question.content} "
          </p>
          <div className="flex flex-col items-center">
            <input
              className="w-full h-20 p-2 mt-3 border-2 border-neutral-400 rounded-lg text-xl"
              placeholder="답변을 입력해주세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={addAnswer} className="w-1/6 p-2 mt-3 border-2">
              제출
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Question;
