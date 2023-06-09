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

const MyAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const { data } = useSession();

  const getAnswers = async () => {
    const q = query(
      answerCollection,
      where("user.email", "==", data?.user?.email)
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
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-y-auto w-full h-[450px]">
        <div className={`flex flex-col items-center w-full`}>
          {answers.map((item) => (
            <SmallAnswerList key={item.id} answer={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAnswers;
