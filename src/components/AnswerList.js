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

  const handleRandom = () => {
    const shuffledAnswers = [...answers];
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledAnswers[i], shuffledAnswers[j]] = [
        shuffledAnswers[j],
        shuffledAnswers[i],
      ];
    }
    setAnswers(shuffledAnswers);
  };

  const toList = () => {
    setLayout(true);
  };
  const toGallery = () => {
    setLayout(false);
  };

  const handleSort = () => {
    const sortedAnswers = [...answers];
    sortedAnswers.sort((a, b) => b.likeUsers.length - a.likeUsers.length);
    setAnswers(sortedAnswers);
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
          <button className="border my-1 mr-1 p-1 " onClick={handleSort}>
            좋아요 순
          </button>
          <button className="border my-1 mr-1 p-1" onClick={handleRandom}>
            ↺
          </button>
        </div>
      </div>
      <div className="w-full h-[80vh]">
        {layout ? (
          <div
            className={`items-center w-full ${
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
