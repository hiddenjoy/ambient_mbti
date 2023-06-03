import { useState } from "react";

const SmallAnswerList = ({ key, answer }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (

    <div className="flex flex-col justify-center my-2 bg-primary text-tertiary p-3 w-full rounded">
      <div className=" border text-xl text-center mb-3">
        " {answer.content} "
      </div>
      <div className="text-end text-xs italic">
        by. {answer.user.mbti} {answer.user.id}
      </div>
      <button onClick={toggleLike}>{liked ? "❤️" : "🤍"}  {answer.likeUsers.length}</button>

    </div>
  );
};

export default SmallAnswerList;
