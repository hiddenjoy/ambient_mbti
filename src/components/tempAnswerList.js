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

const TempAnswerList = ({ num, date }) => {
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

  // const generateRandomAnswers = () => {
  //   const selectedAnswer = [];

  //   for (let i = 0; i < num; i++) {
  //     const randomIndex = Math.floor(Math.random() * answer.length);
  //     const randomItem = answer[randomIndex];

  //     if (!selectedAnswer.includes(randomItem)) {
  //       selectedAnswer.push(randomItem);
  //     } else {
  //       i--; // 중복 요소가 선택되었을 경우 i를 감소하여 다시 선택
  //     }
  //   }

  //   setSelectedAnswers(selectedAnswer);
  // };

  // useEffect(() => {
  //   generateRandomAnswers();
  // }, []);

  // const handleClick = () => {
  //   generateRandomAnswers();
  // };

  const handleSort = () => {
    const sortedAnswers = [...selectedAnswers];
    sortedAnswers.sort((a, b) => b.likeUsers.length - a.likeUsers.length);
    setSelectedAnswers(sortedAnswers);
  };

  return (
    <>
      <div className="sticky top-0 border w-full flex justify-between bg-white">
        {/* <div className="sticky top-0 border w-full flex justify-between bg-white"> */}
          <div>
            <button className="border my-1 mr-1 p-1" onClick={() => setShowListVer(true)}>
              list
            </button>
            <button className="border my-1 mr-1 p-1" onClick={() => setShowListVer(false)}>
              gallery
            </button>
          </div>
          <div>
            <button className="border my-1 mr-1 p-1" onClick={handleSort}>
              좋아요순
            </button>
            <button className="border my-1 mr-1 p-1" >
              ↺
            </button>
          {/* </div> */}
        </div>
      </div>
      {showListVer ? (
        <div className="flex flex-col items-center w-full">
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
