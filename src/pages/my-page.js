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
import { mbtiColors } from "@/data/mbtiColors.js";

const Mypage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null);
  const [viewTag, setViewTag] = useState("calendar");

  useEffect(() => {
    async function fetchUser() {
      if (session && session.user) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setQuestionAnswers(userDoc.data().questionAnswers);
        }
      }
    }

    fetchUser();
  }, [session]);

  const backgroundColor = user?.mbti ? mbtiColors[user.mbti] : null;

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
      <div className="mypage-container" style={{ backgroundColor }}>
        <div className="flex flex-row h-full">
        <div className="h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
          <h1 className="text-4xl font-bold text-primary p-3">
            Mypage
          </h1>
          <UserProfile user={user} />
        </div>
        <div className="basis-4/5 flex flex-col">
          <div>버튼</div>
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
      </div>
    </Layout>
  );
};

export default Mypage;