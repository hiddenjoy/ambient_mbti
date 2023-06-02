import { useState } from "react";

const SmallAnswerList = ({ key, answer }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="my-2 bg-lime-100 p-3 w-full rounded relative flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <div className="border mx-3">{answer.user.mbti}</div>
        <div>답변: {answer.content}</div>
      </div>
      <button onClick={toggleLike}>{liked ? "❤️" : "🤍"}  {answer.likeUsers.length}</button>
    </div>
  );
};

export default SmallAnswerList;
