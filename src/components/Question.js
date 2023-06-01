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
  const { data } = useSession();
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");

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

    // answerList 상태를 업데이트합니다.
    setAnswerList((prevAnswerList) => [...prevAnswerList, docRef]); // 새로운 답변을 추가하여 업데이트
  };

  return (
    <div className="w-full flex flex-col items-center p-5 text-black">
      <div className="w-3xl p-5 bg-lime-100 rounded-3xl">
        <h1 className="text-xl font-bold mb-3">오늘의 질문</h1>
        <p className="text-center">
          {/* 일단 id 값으로 가져옴 (추후에 날짜별로 가져오도록 수정 예정) */}
          {questions.find((q) => q.id === 1).question}
        </p>
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
