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
  limit,
  startAt,
  endAt,
} from "firebase/firestore";

const HorizonAnswerList = ({ range }) => {
  const answerCollection = collection(db, "answers");
  const [answers, setAnswers] = useState([]);

  const getAnswer = async () => {
    const q = query(answerCollection, orderBy("likeUsers", "desc"), limit(30));
    const results = await getDocs(q);

    const newAnswers = [];
    results.docs.forEach((doc) => {
      newAnswers.push({ id: doc.id, ...doc.data() });
    });

    const startIndex = (range - 1) * 10;
    const endIndex = 10 + (range - 1) * 10;
    const selectedAnswers = newAnswers.slice(startIndex, endIndex);

    setAnswers(selectedAnswers);
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return (
    <>
      {answers.map((item) => (
        <SmallAnswerList key={item.id} answer={item} />
      ))}
    </>
  );
};

export default HorizonAnswerList;
