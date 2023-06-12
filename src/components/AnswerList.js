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

  const handleSort = () => {
    const sortedAnswers = [...answers];
    sortedAnswers.sort((a, b) => b.likeUsers.length - a.likeUsers.length);
    setAnswers(sortedAnswers);
  };

  return (
    <div className="sticky top-0 w-full border">
      <div className="flex justify-end bg-neutral-100 p-1">
        <div>
          <button
            className="m-1 py-0 px-4 border rounded-lg"
            onClick={handleSort}
          >
            좋아요순
          </button>
          <button
            className="m-1 py-0 px-4 border rounded-lg"
            onClick={handleRandom}
          >
            셔플
          </button>
        </div>
      </div>

      <div
        className="overflow-auto max-h-[calc(35vh-2rem)]"
        style={{ paddingBottom: "3.5rem" }}
      >
        <div className="w-full">
          {answers.map((item) => (
            <SmallAnswerList key={item.id} answer={item} className="" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnswerList;
