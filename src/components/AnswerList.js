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

const AnswerList = ({ mbti, date }) => {
  const [answers, setAnswers] = useState([]);
  const { data } = useSession();
  const [layout, setLayout] = useState(true);
  const [noMbtiList, setNoMbtiList] = useState([]);

  const getAnswers = async () => {
    const q = query(
      answerCollection,
      where("user.mbti", "==", mbti),
      where("questionDate", "==", date)
    );

    const results = await getDocs(q);

    const newAnswers = [];
    results.docs.forEach((doc) => {
      newAnswers.push({ id: doc.id, ...doc.data() });
    });

    setAnswers(newAnswers);
  };

  useEffect(() => {
    getAnswers();
  }, [mbti, date]);

  const handleClick = () => {
    console.log("새로고침 기능 구현하기");
  };

  const toList = () => {
    setLayout(true);
  };
  const toGallery = () => {
    setLayout(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="sticky top-0 border w-full flex justify-between bg-white">
        <div>
          <button className="border my-1 ml-1 p-1" onClick={toList}>
            list
          </button>
          <button className="border my-1 mr-1 p-1" onClick={toGallery}>
            gallery
          </button>
        </div>
        <div>
          <button className="border my-1 mr-1 p-1" onClick={handleClick}>
            ↺
          </button>
        </div>
      </div>
      <div className="overflow-y-auto w-full h-[450px]">
        {layout ? (
          <div
            className={`flex flex-col items-center w-full ${
              answers.length > 2 ? "animate-slide-up" : ""
            }`}
          >
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
