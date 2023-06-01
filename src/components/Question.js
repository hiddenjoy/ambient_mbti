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

const Question = ({ setAnswerList }) => {
  const answerCollection = collection(db, "answers");
  const userCollection = collection(db, "users");
  const questionCollection = collection(db, "questions");

  const { data } = useSession();
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");

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

  const addAnswer = async () => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "") return;

    // firestore에 추가한 할 일 저장하기.
    // const newDate = new Date();
    // const postDate =
    //   newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString("en-GB");

    const docRef = await addDoc(answerCollection, {
      user: { id: user?.uid, mbti: user?.mbti },
      likeUsers: [],
      content: input,
      questionId: 1,
    });

    setInput("");
  };

  useEffect(() => {
    const getQuestion = async () => {
      const today = new Date();
      const todayDate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

      const q = query(questionCollection, where("date", "==", todayDate));

      // firebase에서 할 일 목록 조회하기
      const results = await getDocs(q);
      setQuestion(results.docs[0].data());
    };

    getQuestion();
  }, [questionCollection]);

  return (
    <div className="w-full flex flex-col items-center p-5 text-black">
      <div className="w-3xl p-5 bg-lime-100 rounded-3xl">
        <div className="text-center text-xl font-bold">오늘의 질문</div>
        <div className="text-xs text-gray-600 text-center mb-3">
          {question.date}{" "}
        </div>
        <p className="text-center">{question.content}</p>
        <div className="flex ">
          <input
            className="w-full p-2 mt-3 border-2 border-neutral-400 rounded-lg"
            placeholder="답변을 입력해주세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={addAnswer} className="w-1/5 p-2 mt-3 border-2">
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question;
