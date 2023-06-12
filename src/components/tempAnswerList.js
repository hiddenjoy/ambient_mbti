import SmallAnswerList from "./SmallAnswerList";
import { useState, useEffect } from "react";
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

const TempAnswerList = ({ date }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showListVer, setShowListVer] = useState(true);

  const getAnswers = async () => {
    const q = query(
      answerCollection,
      where("questionDate", "==", date)
    );

    const results = await getDocs(q);

    const newAnswers = [];
    results.docs.forEach((doc) => {
      newAnswers.push({ id: doc.id, ...doc.data() });
    });

    setSelectedAnswers(newAnswers);
  };

  useEffect(() => {
    getAnswers();
  }, [date]);

  const handleRandomClick = () => {
    const sortedAnswers = [...selectedAnswers];
    for (let i = sortedAnswers.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [sortedAnswers[i], sortedAnswers[randomIndex]] = [
        sortedAnswers[randomIndex],
        sortedAnswers[i],
      ];
    }
    setSelectedAnswers(sortedAnswers);  
  };

  const handleSort = () => {
    const sortedAnswers = [...selectedAnswers];
    sortedAnswers.sort((a, b) => b.likeUsers.length - a.likeUsers.length);
    setSelectedAnswers(sortedAnswers);
  };

  return (
    <>
      <div className="sticky top-0 w-full flex justify-between">
        <div>
          <button className="m-1 p-1 bg-neutral-100 rounded-lg" onClick={() => setShowListVer(true)}>
            list
          </button>
          <button className="m-1 p-1 bg-neutral-100 rounded-lg" onClick={() => setShowListVer(false)}>
            gallery
          </button>
        </div>
        <div>
          <button className="m-1 p-1 bg-neutral-100 rounded-lg" onClick={handleSort}>
            좋아요순
          </button>
          <button className="m-1 p-1 bg-neutral-100 rounded-lg" onClick={handleRandomClick}>
            랜덤순
          </button>
        </div>
      </div>
      {showListVer ? (
        <div className="flex flex-col items-center w-4/5">
          {selectedAnswers.map((item) => (
            <SmallAnswerList key={item.id} answer={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {selectedAnswers.map((item) => (
            <SmallAnswerList key={item.id} answer={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default TempAnswerList;
