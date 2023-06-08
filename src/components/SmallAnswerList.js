import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

const userCollection = collection(db, "users");
const answerCollection = collection(db, "answers");

const SmallAnswerList = ({ answer }) => {
  const { data } = useSession();
  const [liked, setLiked] = useState();
  const [likedUserNum, setLikedUserNum] = useState();

  useEffect(() => {
    setLiked(
      answer.likeUsers.length > 0 &&
        answer.likeUsers.find((i) => i === data.user.id)
    );
  }, []);

  useEffect(() => {
    setLikedUserNum(answer.likeUsers.length);
  }, [answer.likeUsers]);

  const likeAnswer = async (answerId) => {
    console.log(answerId);
    const answerRef = doc(answerCollection, answerId);
    const answerSnapShot = await getDoc(answerRef);
    const answerData = answerSnapShot.data();
    const likedAnswerData = Boolean(
      answerData.likeUsers.length > 0 &&
        answerData.likeUsers.find((i) => i === data.user.id)
    );

    if (likedAnswerData) {
      const updatedLikeUsers = answerData.likeUsers.filter(
        (userId) => userId !== data.user.id
      );
      await updateDoc(answerRef, { likeUsers: updatedLikeUsers });
      setLiked(false);
      setLikedUserNum(updatedLikeUsers.length);
    } else {
      const updatedLikeUsers = [...answerData.likeUsers, data.user.id];
      await updateDoc(answerRef, { likeUsers: updatedLikeUsers });
      setLiked(true);
      setLikedUserNum(updatedLikeUsers.length);
    }
  };
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  const truncatedContent = truncateText(answer.content, 50); // 글자 제한을 50으로 설정

  return (
    <div className="flex flex-col justify-between my-2 bg-primary text-tertiary p-3 w-full rounded">
      <div className=" border text-lg text-center mb-3">
        " {truncatedContent} "
      </div>
      <div className="flex flex-row justify-end items-end">
        <div className="text-end text-xs italic">
          by. {answer.user.mbti} {answer.user.id}
        </div>
        <button
          onClick={() => likeAnswer(answer.id)}
          className="ml-3 my-0 px-2 py-0 text-black"
        >
          {liked ? "❤️" : "🤍"} {likedUserNum}
        </button>
      </div>
    </div>
  );
};

export default SmallAnswerList;
