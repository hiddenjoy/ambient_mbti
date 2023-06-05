import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { collection, query, getDocs, where, doc } from "firebase/firestore";
import SmallAnswerList from "./SmallAnswerList";

const userCollection = collection(db, "users");
const answerCollection = collection(db, "answers");

const LikedAnswers = () => {
  const { data } = useSession();
  const [likedAnswers, setLikedAnswers] = useState([]);

  const getLikedAnswers = async () => {
    const q = query(
      answerCollection,
      where("likeUsers", "array-contains", data.user.id)
    );

    const results = await getDocs(q);

    const likedAnswers = results.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(likedAnswers);
    setLikedAnswers(likedAnswers);
  };

  useEffect (() => {
    getLikedAnswers()
  }, []);
  
  return (
    <div className="my-8 w-full">
      <h2 className="text-3xl font-bold mb-4 ">내가 좋아요한 답변</h2>
      <div className="w-full">
        <div className="px-50">
          {likedAnswers.map((item) => (
                <SmallAnswerList key={item.id} answer={item}/>
              ))}
        </div>
      </div>
    </div>
  );
};

export default LikedAnswers;
