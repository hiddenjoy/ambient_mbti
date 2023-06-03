import React, { useState } from "react";
import TempAnswerList from "@/components/tempAnswerList";
import AnswerList from "../components/AnswerList";
import mbti from "@/data/mbti";

const LikedAnswers = () => {
  const [likedAnswers, setLikedAnswers] = useState([]);

  return (
    <div className="my-8 w-full">
      <h2 className="text-3xl font-bold mb-4 "  >좋아요를 표시한 답변</h2>
      <div className="w-full">
        <div className="px-50">
        <AnswerList
                mbti={mbti}
              />
        </div>
      </div>
    </div>
  );
};

export default LikedAnswers;
