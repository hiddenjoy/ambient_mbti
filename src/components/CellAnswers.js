import React, { useState, useEffect } from "react";
import { format } from 'date-fns';import SmallAnswerList from "@/components/SmallAnswerList";
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

const CellAnswers = ({ selectedDate }) => {
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
    if (data) {
      const fetchUserAnswers = async () => {
        const userId = data.user.id;

        const q = query(answerCollection, where('user.id', '==', userId));
        const answerSnapshot = await getDocs(q);
        const answers = answerSnapshot.docs.map((doc) => doc.data());

        let filteredAnswers = [];

        if (selectedDate) {
          // 선택된 날짜의 질문에 대한 답변만 필터링
          const questionDate = format(selectedDate, 'yyyy-MM-dd');
          filteredAnswers = answers.filter((answer) => answer.questionDate === questionDate);
        } else {
          filteredAnswers = answers;
        }

        setAnswers(filteredAnswers);
      };

      fetchUserAnswers();
    }
  }, [data, selectedDate]);

  return (
    <div className="overflow-y-auto w-full h-[450px]">
        <div className={`flex flex-col items-center w-full`}>
          {answers.map((item) => (
            <AmbientAnswerList key={item.id} answer={item} />
          ))}
        </div>
      </div>
  );
};

export default CellAnswers;
