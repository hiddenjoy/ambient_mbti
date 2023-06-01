import SmallAnswer from "./SmallAnswer";
import { answer } from "@/data/answer.js";
import { useState, useEffect } from 'react';

const TempAnswerList = () => {
  const [fiveAnswers, setFiveAnswers] = useState([]);

  const generateRandomAnswers = () => {
    const selectedAnswers = [];

    for (let i = 0; i < 5; i++) {
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
      <div className="w-full flex justify-end">
        <button onClick={handleClick}>↺</button>
      </div>
      <div className="w-full">
        {fiveAnswers.map((item) => (
        <SmallAnswer key={item.id} answer={item} />
      ))}
      </div>
    </>
  );
};

export default TempAnswerList;