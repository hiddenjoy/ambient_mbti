import Layout from "@/components/Layout";
import UserProfile from "@/components/UserProfile";
import FollowingUsers from "@/components/FollowingUser";
import LikedAnswers from "@/components/LikedAnswer";
import { format } from "date-fns";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

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