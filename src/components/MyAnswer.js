import React, { useState, useEffect } from "react";
import SmallAnswerList from "@/components/SmallAnswerList";
import AmbientAnswerList from "@/components/AmbientAnswerList";
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

const questionCollection = collection(db, "questions");
const answerCollection = collection(db, "answers");
const userCollection = collection(db, "users");

const MyAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [sortedByLikes, setSortedByLikes] = useState(false);
  const [sortedByTimestamp, setSortedByTimestamp] = useState(false);
  const { data } = useSession();

  const getAnswers = async () => {
    const q = query(
      answerCollection,
      where("user.id", "==", data?.user?.id)
    );
    const querySnapshot = await getDocs(q);

    const newAnswers = [];
    querySnapshot.forEach((doc) => {
      const answerData = doc.data();
      newAnswers.push({ id: doc.id, ...answerData });
    });

    // 질문의 생성 날짜를 기준으로 내림차순 정렬
    newAnswers.sort((a, b) => {
      return (
        new Date(b.questionDate).getTime() - new Date(a.questionDate).getTime()
      );
    });

    setAnswers(newAnswers);
  };

  useEffect(() => {
    getAnswers();
  }, []);

  const handleSortByLikes = () => {
    const sortedAnswers = [...answers];
    sortedAnswers.sort((a, b) => b.likeUsers.length - a.likeUsers.length);
    setAnswers(sortedAnswers);
    setSortedByLikes(true);
    setSortedByTimestamp(false);
  };

  const handleSortByTimestamp = () => {
    const sortedAnswers = [...answers];
    sortedAnswers.sort((a, b) => {
      return (
        new Date(b.questionDate).getTime() - new Date(a.questionDate).getTime()
      );
    });
    setAnswers(sortedAnswers);
    setSortedByLikes(false);
    setSortedByTimestamp(true);
  };

  const handleResetSort = () => {
    getAnswers();
    setSortedByLikes(false);
    setSortedByTimestamp(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-start">
        <button className="border mr-2 px-2 py-1" onClick={handleSortByLikes}>
          좋아요순
        </button>
        <button
          className="border mr-2 px-2 py-1"
          onClick={handleSortByTimestamp}
        >
          최신순
        </button>
        <button className="border px-2 py-1" onClick={handleResetSort}>
        ↺
        </button>
      </div>
      <div className="overflow-y-auto w-full h-[450px]">
        <div className={`flex flex-col items-center w-full`}>
          {answers.map((item) => (
            <AmbientAnswerList key={item.id} answer={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAnswers;
