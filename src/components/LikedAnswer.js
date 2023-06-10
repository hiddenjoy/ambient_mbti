import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { collection, query, getDocs, where, doc } from "firebase/firestore";
import SmallAnswerList from "./SmallAnswerList";
import AmbientAnswerList from "./AmbientAnswerList";

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
    <div className="flex flex-wrap">
      <div className="my-8 w-full">
        {likedAnswers.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-4 ">내가 좋아요한 답변</h2>
            <div className="w-full">
              <div className="px-50">
                {likedAnswers.map((item) => (
                  <SmallAnswerList key={item.id} answer={item} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className>
          <div className="flex flex-row items-center h-full">
            <div className="basis-1/3 flex h-full flex-col items-end"></div>
            <div className="basis-1/2 flex h-full flex-col items-center ">
              <div className=" w-full ">
                <div className="w-full mt-10 mb-10 items-center">
                  <img
                    src="/images/Amber likedanswer.png"
                    alt="0 팔로잉 이미지"
                    style={{
                      maxWidth: "40%",
                      height: "auto",
                      maxHeight: "auto",
                      display: "block",
                      top: "50%",
                      transform: "translateY(10%)",
                      marginTop: "20% auto",
                      marginLeft: "10%",
                      marginTop: "25%",
                    }}
                  />
                  <div
                    className="basis-1/2 mb-5 w-full text-center mt-5  "
                    style={{
                      marginLeft: "-19%",
                      marginTop: "6%",
                      display: "block",
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#",
                      whiteSpace: "nowrap",
                    }}
                  >
                    답변에 좋아요를 눌러보세요!
                  </div>
  
                  {/* <div
                    className="basis-1/2 mb-1 w-full text-center mt-1 textAlign:'center'"
                    style={{
                      marginLeft: "-17%",
                      display: "block",
                      fontWeight: "regular",
                      marginRight: "-17%",
                      fontSize: "14px",
                      color: "#6D6E71",
                      whiteSpace: "nowrap",
                    }}
                  >
                    로그인하여 당신의 이야기를 들려주세요!
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        )}
      </div>
    </div>
  );
};

export default LikedAnswers;
