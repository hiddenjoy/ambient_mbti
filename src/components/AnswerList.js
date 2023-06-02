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

const answerCollection = collection(db, "answers");
const userCollection = collection(db, "users");

const AnswerList = ({ mbti }) => {
  const [answers, setAnswers] = useState([]);
  const { data } = useSession();
  const [layout, setLayout] = useState(true);

  const getAnswers = async () => {
    console.log(mbti);

    const q = query(answerCollection, where("user.mbti", "==", mbti));

    const results = await getDocs(q);

    const newAnswers = [];
    results.docs.forEach((doc) => {
      newAnswers.push({ id: doc.id, ...doc.data() });
    });
    setAnswers(newAnswers);
  };

  useEffect(() => {
    getAnswers();
  }, [mbti]);

  const handleClick = () => {
    console.log("새로고침 기능 구현하기");
  };

  const handleLayout = () => {
    setLayout(!layout);
  };

  return (
    <div className="flex flex-col">
      <div className="border w-full flex justify-between">
        <div>
          <button className="border my-1 ml-1 p-1" onClick={handleLayout}>
            list
          </button>
          <button className="border my-1 mr-1 p-1" onClick={handleLayout}>
            gallery
          </button>
        </div>
        <div>
          <button className="border my-1 mr-1 p-1" onClick={handleClick}>
            ↺
          </button>
        </div>
      </div>
      <div>
        {layout ? (
          <div className="flex flex-col items-center w-full">
            {answers.map((item) => (
              <SmallAnswerList key={item.id} answer={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {answers.map((item) => (
              <SmallAnswerList key={item.id} answer={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerList;
