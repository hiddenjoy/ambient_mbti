import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

const userCollection = collection(db, "users");
const answerCollection = collection(db, "answers");

const SmallAnswerList = ({ answer, onClick }) => {
  const { data } = useSession();
  const [liked, setLiked] = useState();
  const [likedUserNum, setLikedUserNum] = useState();

  useEffect(() => {
    setLikedUserNum(answer.likeUsers.length);
    console.log(likedUserNum);
  }, [answer.likeUsers]);

  const likeAnswer = async (answerId) => {
    const answerRef = doc(answerCollection, answerId);
    const answerSnapShot = await getDoc(answerRef);
    const answerData = answerSnapShot.data();
    const likedAnswerData = Boolean(answerData.likeUsers.length > 0 ? answerData.likeUsers.find((i) => i === data.user.id) : false);

    if(likedAnswerData) {
      const updatedLikeUsers = answerData.likeUsers.filter(
        (userId) => userId !== data.user.id
      );
      await updateDoc(answerRef, { likeUsers: updatedLikeUsers });
      setLiked(false);
      setLikedUserNum(updatedLikeUsers.length);
      console.log(likedUserNum);
    } else {
      const updatedLikeUsers = [...answerData.likeUsers, data.user.id];
      await updateDoc(answerRef, { likeUsers: updatedLikeUsers });
      setLiked(true);
      setLikedUserNum(updatedLikeUsers.length);
      console.log(likedUserNum);
    }
  };

  return (

    <div className="flex flex-col justify-center my-2 bg-primary text-tertiary p-3 w-full rounded">
      <div className=" border text-xl text-center mb-3">
        " {answer.content} "
      </div>
      <div className="text-end text-xs italic">
        by. {answer.user.mbti} {answer.user.id}
      </div>
      <button onClick={() => likeAnswer(answer.id)}>{liked ? "❤️" : "🤍"}  {likedUserNum}</button>

    </div>
  );
};

export default SmallAnswerList;
