import Layout from "@/components/Layout";
import UserProfile from "@/components/UserProfile";
import { format } from "date-fns";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase/index.js";
import { useRouter } from 'next/router';
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";

const userCollection = collection(db, "users");

const AnotherUser = ({ userId }) => {
  const { data } = useSession();
  // const [user, setUser] = useState(null);
  const [anotherUserId, setanotherUserId] = useState();
  const [anotherUser, setAnotherUser] = useState();

  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null);

  //팔로잉
  const [ following, setFollowing ] = useState();

  const getAnotherUser = async (id) => {
      const userRef = doc(userCollection, id);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      setAnotherUser(userData);
      setanotherUserId(userRef.id);
      setFollowing(Boolean(
        anotherUser.followerId &&
        anotherUser.followerId.find((i) => i === userId)
      ));
  };
    

  useEffect(() => {
    getAnotherUser();
  }, [userId]);

  const handleDatePopup = (date) => {
    setPopupDate(date);
  };

  // 팔로잉 구현
  // useEffect(() => {
  // }, [anotherUser]);

  const handleFollowing = () => {
    updateFollowing();
    updateFollower();
  };
  
  const updateFollowing = async () => {
    const userRef = doc(userCollection, data.user.id);
    const profiledUserRef = doc(userCollection, profiledUserId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    if (!following){
      const updatedFollowingId = userData.followingId.filter(
        (id) => id !== profiledUserId
      );
      await setDoc(userRef, { followingId: updatedFollowingId});
      setFollowing(!following);
    }else {
      const updatedFollowingId = [...userData.followingId || [], profiledUserRef.id];
      await setDoc(userRef, { followingId: updatedFollowingId });
      setFollowing(!following);
      
    }
  };

  const updateFollower = async () => {
    const userRef = doc(userCollection, data.user.id);
    const profiledUserRef = doc(userCollection, profiledUserId);
    const profiledUserSnapshot = await getDoc(profiledUserRef);
    const profiledUserData = profiledUserSnapshot.data();

    if(!following) {
      const updatedFollwerID = profiledUserData.followerId.filter(
        (id) => id !== data.user.id
      );
      await setDoc(profiledUserRef, { followerId: updatedFollwerID});
    }else {
      const updatedFollwerID = [...profiledUserData.followerId || [], userRef.id];
      await setDoc(profiledUserRef, { followerId: updatedFollwerID });
      
    }      
    setFollowerNum(profiledUserData.followerId.length);

  };


  return (
    <>
      {following ? (
        <button onClick={handleFollowing}>
          <p className="font-semibold">팔로잉 취소</p>
        </button>
      ) : (
        <button onClick={handleFollowing}>
          <p className="font-semibold">팔로잉</p>
        </button>
      )}
      <Layout>
        <div className="flex flex-row h-full">
          <div className="w-full h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
            <h1 className="text-4xl font-bold text-primary p-3">
              's page
            </h1>
            <UserProfile profiledUserId={userId} />
          </div>
          
          {/* 여기 캘린더 부분은 나중에 수정해야함 ㅠㅠ!! */}
          <div className="basis-4/5 flex flex-col">
            <div className="flex flex-row">
            </div>
            <div className="bg-neutral-100 h-full">
              <>
                {/* 주간 캘린더 */}
                <WeeklyCalendar handleDatePopup={handleDatePopup} />

                {/* 팝업 */}
                {popupDate && (
                  <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4">
                      <h2 className="text-lg font-bold mb-2">
                        {format(popupDate, "yyyy년 MM월 dd일")}
                      </h2>
                      {/* 팝업 내용을 구현해야함*/}
                      {/* 질문 답변 데이터 끌어올 예정 */}
                      {questions.map((question) => (
                        <div key={question.id} className="mt-4">
                          <h2 className="text-2xl font-bold">
                            {question.question}
                          </h2>
                          <p className="text-gray-500">
                            {question.askDate}
                          </p>
                          {/* 답변을 보여주는 로직 */}
                          {questionAnswers &&
                            questionAnswers.map((qa) => {
                              if (
                                qa.askDate ===
                                format(popupDate, "yyyy-MM-dd")
                              ) {
                                return (
                                  <div key={qa.id} className="mb-4">
                                    <p className="text-lg font-semibold mb-2">
                                      {qa.askDate}
                                    </p>
                                    <p className="text-lg">
                                      질문: {qa.question}
                                    </p>
                                    <p className="text-lg">
                                      답변: {qa.answer}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </div>
                      ))}
                      <button
                        className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                        onClick={() => setPopupDate(null)} // 팝업 닫기
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AnotherUser;