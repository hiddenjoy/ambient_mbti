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

  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null); // 날짜
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady, id]);

  const getAnotherUser = async () => {
    const userRef = doc(userCollection, id);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    setanotherUserId(id);
  };
    
  useEffect(() => {
    getAnotherUser();
  },[id]);

  const handleDatePopup = (date) => {
    setPopupDate(date);
  };

  return (
    <>
      <Layout>
        <div className="flex flex-row h-full">
          <div className="w-full h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
            <h1 className="text-4xl font-bold text-primary p-3">
              's page
            </h1>
            {/* <div className="relative"> */}
              <UserProfile profiledUserId={id} />
              {/* <div className="m-0 absolute bottom-2 right-2">
              </div>  */}
            {/* </div> */}
          </div>
          <UserCalendar handleDatePopup={handleDatePopup} bgColor={bgColor}/>
        </div>
      </Layout>
    </>
  );
};

export default AnotherUserId;