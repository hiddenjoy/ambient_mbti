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

const AnswerList = ({ answerList }) => {
  const [answers, setAnswers] = useState([]);
  const { data } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // answerList 상태가 변경될 때마다 실행되는 로직
    console.log("AnswerList 업데이트됨");
  }, [answerList]);

  useEffect(() => {
    async function fetchUser() {
      if (data) {
        const userRef = doc(db, "users", data.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    }

    fetchUser();
  }, [data]); // data를 의존성 배열에 추가

  useEffect(() => {
    if (user) {
      getAnswers();
    }
  }, [user]); // user를 의존성 배열에 추가

  const getAnswers = async () => {
    if (!user?.mbti) return;

    const q = query(answerCollection, where("user.mbti", "==", user?.mbti));

    const results = await getDocs(q);
    const newAnswers = [];
    results.docs.forEach((doc) => {
      newAnswers.push({ id: doc.id, ...doc.data() });
    });

    setAnswers(newAnswers);
  };

  return (
    <>
      <div>
        <ul>
          {answers.map((answer) => (
            <SmallAnswerList key={answer.id} answer={answer} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default AnswerList;
