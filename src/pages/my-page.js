import Layout from "@/components/Layout";
import UserProfile from "@/components/UserProfile";
import FollowingUsers from "@/components/FollowingUser";
import LikedAnswers from "@/components/LikedAnswer";
import { format } from "date-fns";
import UserCalendar from "@/components/UserCalendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import mbtiColors from "@/data/mbtiColors.js";

const Mypage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null);
  const [viewTag, setViewTag] = useState("calendar");
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정

  useEffect(() => {
    async function fetchUser() {
      if (session && session.user) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setQuestionAnswers(userDoc.data().questionAnswers);
        
          const userMbti = userDoc.data().mbti; // 세션 유저의 mbti 가져오기
          const mbtiColor = mbtiColors[userMbti]; // mbtiColors에서 해당 mbti의 색상 가져오기

          if (mbtiColor) {
            setBgColor(mbtiColor);
          }
        }
      }
    }

    fetchUser();
  }, [session]);

  const handleDatePopup = (date) => {
    setPopupDate(date);
  };

  const ViewTagButton = ({value}) => {
    return(
      <div className="flex flex-row">
        <button onClick={() => {setViewTag(value)}} className="mr-3 my-3 px-2 bg-lime-100 rounded ">{value}</button>
      </div>
    );
  }


  return (
    <Layout>
      <div 
      className="flex flex-row h-full"
      style={{ backgroundColor: bgColor }}>
        <div className="h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
          <h1 className="text-4xl font-bold text-primary p-3">
            Mypage
          </h1>
          <UserProfile user={user} />
        </div>
        <div className="basis-4/5 flex flex-col">
          <div className="flex flex-row">
            <ViewTagButton value="calendar"/>
            <ViewTagButton value="likedAnswers"/>
            <ViewTagButton value="followingUsers"/>
          </div>
          <div className="bg-neutral-100 h-full">
            {viewTag === 'calendar' ? (
              <UserCalendar handleDatePopup={handleDatePopup}/>
            ) : viewTag === 'likedAnswers' ? (
              <LikedAnswers/>
            ) : viewTag === 'followingUsers' ? (
              <FollowingUsers />
            ) : (
              <div>Invalid viewTag</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mypage;