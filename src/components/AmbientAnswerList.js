import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import {
  where,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  getDocs,
} from "firebase/firestore";
import mbtiColors from "../data/mbtiColors.js";

const userCollection = collection(db, "users");
const answerCollection = collection(db, "answers");
const questionCollection = collection(db, "questions");

const AmbientAnswerList = ({ answer }) => {
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정
  const { data } = useSession();
  const [liked, setLiked] = useState();
  const [likedUserNum, setLikedUserNum] = useState();
  const [question, setQuestion] = useState();

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

  const getQuestion = async () => {
    const q = query(
      collection(db, "questions"),
      where("date", "==", answer.questionDate)
    );
    const querySnapshot = await getDocs(q);
    const questionData = querySnapshot.docs[0]?.data(); // 수정된 부분
    if (questionData) {
      setQuestion(questionData);
    }
  };

  useEffect(() => {
    if (answer.user.mbti) {
      const mbtiColor = mbtiColors[answer.user.mbti]; // mbti.js에서 해당 mbti의 색상을 가져옴

      if (mbtiColor) {
        setBgColor(mbtiColor);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      setLiked(
        answer.likeUsers.length > 0 &&
          answer.likeUsers.find((i) => i === data.user.id)
      );
      getQuestion();
    }
  }, []);

  useEffect(() => {
    setLikedUserNum(answer.likeUsers.length);
  }, [answer.likeUsers]);

  return (
    <div
      className="flex flex-col my-2 justify-between text-neutral-800 p-3 w-full rounded"
      style={{ backgroundColor: bgColor }} // 배경색을 동적으로 설정
    >
      <div className="mb-7">
        {question && (
          <>
            <div className="flex text-xs">{question.date}</div>
            <div className="flex text-base">Q: {question.content}</div>
          </>
        )}
      </div>
      <div className="flex flex-col justify-end items-end my-0 w-full">
        <Link
          href="/anotherUser/[id]"
          as={`/anotherUser/${answer.user.id}`}
          className="w-full"
        >
          <div className="text-base text-center mb-3 h-24 overflow-scroll bg-white/40 w-full">
            " {truncatedContent} "
          </div>
          <div className="text-end text-xs italic flex flex-row items-center justify-end">
            by.{" "}
            <img
              src={`/images/MBTIcharacters/${answer.user.mbti}.png`}
              className="w-7"
            />
            {answer.user.mbti}
          </div>
        </Link>
        <button
          onClick={() => likeAnswer(answer.id)}
          className=" my-0 px-3 py-1 text-black text-xs bg-neutral-100 bg-opacity-50"
        >
          {liked ? "❤️" : "🤍"} {likedUserNum}
        </button>
      </div>
    </div>
  );
};

export default AmbientAnswerList;
