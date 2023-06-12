import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { collection, doc, getDoc, updateDoc, query } from "firebase/firestore";
import mbtiColors from "../data/mbtiColors.js";

const userCollection = collection(db, "users");
const answerCollection = collection(db, "answers");

const SmallAnswerList = ({ answer }) => {
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정
  const { data } = useSession();
  const [liked, setLiked] = useState();
  const [likedUserNum, setLikedUserNum] = useState();

  useEffect(() => {
    if (data) {
      setLiked(
        answer.likeUsers.length > 0 &&
          answer.likeUsers.find((i) => i === data.user.id)
      );
    }
  }, []);

  useEffect(() => {
    setLikedUserNum(answer.likeUsers.length);
  }, [answer.likeUsers]);

  const likeAnswer = async (answerId) => {
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

  useEffect(() => {
    if (answer.user.mbti) {
      const mbtiColor = mbtiColors[answer.user.mbti]; // mbti.js에서 해당 mbti의 색상을 가져옴

      if (mbtiColor) {
        setBgColor(mbtiColor);
      }
    }
  }, []);

  return (
    <div
      className="flex flex-col w-full my-2 rounded justify-between"
      style={{ backgroundColor: bgColor }}
    >
      <Link
        href="/anotherUser/[id]"
        as={`/anotherUser/${answer.user.id}`}
        className="flex flex-col justify-between text-neutral-800 p-3 w-full rounded"
      >
        <div className="text-lg text-center mb-3 bg-white/30">
          " {truncatedContent} "
        </div>
      </Link>
      <div className="flex flex-row justify-end items-center">
        <div className="text-end text-xs italic flex flex-row items-center justify-end">
          by.{" "}
          <img
            src={`/images/MBTIcharacters/${answer.user.mbti}.png`}
            className="w-8"
          />
          {answer.user.mbti}
        </div>
        <button
          onClick={() => likeAnswer(answer.id)}
          className="mx-3 my-0 px-2 py-0 text-black"
        >
          {liked ? "❤️" : "🤍"} {likedUserNum}
        </button>
      </div>
    </div>
  );
};

export default SmallAnswerList;
