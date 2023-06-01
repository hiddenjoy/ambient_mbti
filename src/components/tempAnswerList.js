import SmallAnswerList from "./SmallAnswerList";
import { answer } from "@/data/answer.js";
import { useState, useEffect } from 'react';

const TempAnswerList = () => {
  const [fiveAnswers, setFiveAnswers] = useState([]);
  const [showListVer, setShowListVer] = useState(true);

  const generateRandomAnswers = () => {
    const selectedAnswers = [];

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * answer.length);
      const randomItem = answer[randomIndex];

      if (!selectedAnswers.includes(randomItem)) {
        selectedAnswers.push(randomItem);
      } else {
        i--; // 중복 요소가 선택되었을 경우 i를 감소하여 다시 선택
      }
    }

    setFiveAnswers(selectedAnswers);
  };

  useEffect(() => {
    generateRandomAnswers();
  }, []);

  const handleClick = () => {
    generateRandomAnswers();
  };

  return(
    <>
      <div className="w-full flex justify-between">
        <button onClick={() => setShowListVer(true)}>list</button>
        <button onClick={() => setShowListVer(false)}>gallery</button>
        <button onClick={handleClick}>↺</button>
      </div>
      {showListVer ? (
        <div className="flex flex-col items-center w-full">
          {(fiveAnswers.map((item) => (
            <SmallAnswerList key={item.id} answer={item} />
          )))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {(fiveAnswers.map((item) => (
            <SmallAnswerList key={item.id} answer={item} />
          )))}
        </div>
      )}
    </>
  );
};

export default TempAnswerList;