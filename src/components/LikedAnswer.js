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
  const [showListVer, setShowListVer] = useState(false);

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

    setLikedAnswers(likedAnswers);
  };

  useEffect(() => {
    getLikedAnswers();
  }, []);

  const handleSort = () => {
    const sortedAnswers = [...likedAnswers];
    sortedAnswers.sort((a, b) => b.likeUsers.length - a.likeUsers.length);
    setLikedAnswers(sortedAnswers);
  };

  const handleRandomClick = () => {
    const sortedAnswers = [...likedAnswers];
    for (let i = sortedAnswers.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [sortedAnswers[i], sortedAnswers[randomIndex]] = [
        sortedAnswers[randomIndex],
        sortedAnswers[i],
      ];
    }
    setLikedAnswers(sortedAnswers);
  };

  const handleSortByTimestamp = () => {
    const sortedAnswers = [...likedAnswers];
    sortedAnswers.sort(
      (a, b) =>
        new Date(b.questionDate).getTime() - new Date(a.questionDate).getTime()
    );

    setLikedAnswers(sortedAnswers);
  };

  return (
    <div className="flex flex-wrap">
      <div className="sticky top-0 w-full flex justify-end bg-neutral-200">
        <button
          className="m-1 py-0 px-4 border rounded-lg"
          onClick={handleSort}
        >
          좋아요순
        </button>
        <button
          className="m-1 py-0 px-4 border rounded-lg"
          onClick={handleSortByTimestamp}
        >
          최신순
        </button>
        <button
          className="m-1 py-0 px-4 border rounded-lg"
          onClick={handleRandomClick}
        >
          셔플
        </button>
      </div>
      <div className="flex flex-col items-center w-full overflow-auto max-h-[65vh]">
        {likedAnswers.length > 0 ? (
          <>
            {showListVer ? (
              <div className="flex flex-col items-center w-4/5">
                {likedAnswers.map((item) => (
                  <AmbientAnswerList key={item.id} answer={item} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {likedAnswers.map((item) => (
                  <AmbientAnswerList key={item.id} answer={item} />
                ))}
              </div>
            )}
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
