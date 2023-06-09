import Layout from "@/components/Layout";
import UserProfile from "@/components/UserProfile";
import { format } from "date-fns";
import UserCalendar from "@/components/UserCalendar";
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

const AnotherUserId = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSession();
  const [anotherUserId, setanotherUserId] = useState();
  // const [anotherUser, setAnotherUser] = useState();

  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null); // 날짜
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정

  //팔로잉
  const [ following, setFollowing ] = useState();
  const [ followerNum, setFollowerNum ] = useState();
  const [ followingNum, setFollowingNum ] = useState();

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady, id]);

  const getAnotherUser = async () => {
    const userRef = doc(userCollection, id);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    // setAnotherUser(userData);
    setanotherUserId(id);

    setFollowing(Boolean(
      userRef.followerId &&
      userRef.followerId.find((i) => i === id)
    ));

    setFollowerNum(userRef.followerId ? userRef.followerId.length : 0);
    setFollowingNum(userRef.followingId ? userRef.followingId.length : 0);
  };
    
  useEffect(() => {
    getAnotherUser();
  },[id]);

  const handleDatePopup = (date) => {
    setPopupDate(date);
  };

  // 팔로잉 구현
  const handleFollowing = () => {
    updateFollow();
  };

  const handleUnFollowing = () => {
    unFollow();
  };
  
  const updateFollow = async () => {
    //사용자 데이터 참조
    const userRef = doc(userCollection, data.user.id);    
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    //anotherUser 데이터 참조
    const profiledUserRef = doc(userCollection, anotherUserId);
    const profiledUserSnapshot = await getDoc(profiledUserRef);
    const profiledUserData = profiledUserSnapshot.data();

      const updatedFollowingId = [...userData.followingId || [], profiledUserRef.id];
      await updateDoc(userRef, { followingId: updatedFollowingId });
      
      const updatedFollwerID = [...profiledUserData.followerId || [], userRef.id];
      await updateDoc(profiledUserRef, { followerId: updatedFollwerID });

      setFollowing(!following);
      setFollowerNum(profiledUserRef.followerId ? profiledUserRef.followerId.length : 0);
  };

  const unFollow = async () => {
    //사용자 데이터 참조
    const userRef = doc(userCollection, data.user.id);    
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    //anotherUser 데이터 참조
    const profiledUserRef = doc(userCollection, anotherUserId);
    const profiledUserSnapshot = await getDoc(profiledUserRef);
    const profiledUserData = profiledUserSnapshot.data();

    const updatedFollowingId = userData.followingId.filter(
      (id) => id !== anotherUserId
    );
    await setDoc(userRef, { followingId: updatedFollowingId}, { merge: true });

    const updatedFollwerID = profiledUserData.followerId.filter(
      (id) => id !== data.user.id
    );
    await setDoc(profiledUserRef, { followerId: updatedFollwerID}, { merge: true });

    setFollowing(!following);
    setFollowerNum(profiledUserRef.followerId ? profiledUserRef.followerId.length : 0);
  };


  return (
    <>
      <Layout>
        <div className="flex flex-row h-full">
          <div className="w-full h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
            <h1 className="text-4xl font-bold text-primary p-3">
              's page
            </h1>
            <div className="relative">
              <UserProfile profiledUserId={id} />
              <div className="m-0 absolute bottom-2 right-2">
                {following ? (
                  <button onClick={handleUnFollowing} className="bg-neutral-100 m-0 p-1 rounded-xl">
                    <p className="font-semibold">팔로잉 취소</p>
                  </button>
                ) : (
                  <button onClick={handleFollowing} className="bg-neutral-100 m-0 p-1 rounded-xl">
                    <p className="font-semibold">팔로우</p>
                  </button>
                )}
              </div> 
            </div>
          </div>
          <UserCalendar handleDatePopup={handleDatePopup} bgColor={bgColor}/>
        </div>
      </Layout>
    </>
  );
};

export default AnotherUserId;