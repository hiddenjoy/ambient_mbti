import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/index.js";
import MbtiSelector from "../components/mbtiSelector";
import Footer from "../components/Footer";
import AnswerList from "@/components/AnswerList";

export default function Compare() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answerList, setAnswerList] = useState([]);
  const [firstMbti, setFirstMbti] = useState("");
  const [secondMbti, setSecondMbti] = useState("");
  const questionCollection = collection(db, "questions");
  const [question, setQuestion] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setIsLoggedIn(true);
          setFirstMbti(userDoc.data().mbti);
          setSecondMbti("ENFP");
        }
      }
    }

    fetchUser();
  }, [session]);

  const getQuestion = async () => {
    const formattedDate = currentDate.toISOString().split("T")[0];

    const q = query(questionCollection, where("date", "==", formattedDate));
    const results = await getDocs(q);

    setQuestion(results.docs[0].data());
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const goPrevious = async () => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setCurrentDate(previousDate);
  };

  const goNext = async () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  useEffect(() => {
    getQuestion();
  }, [currentDate]);

  return (
    <>
      <Layout>
        {isLoggedIn ? (
          <>
            <div className="flex flex-col">
              <div className="flex flex-row w-full p-5 mb-5 border items-center justify-center">
                <button className="m-0 p-0 mr-2" onClick={goPrevious}>
                  ◀
                </button>
                <div className="text-xs text-gray-600 text-center whitespace-normal">
                  {question.date}
                </div>
                <button className="m-0 p-0 ml-2" onClick={goNext}>
                  ▶
                </button>
              </div>

              <div className="flex flex-row">
                <div className="w-full border flex flex-col border-3 basis-1/2 items-center p-3">
                  <div className="w-3/4 flex flex-col justify-center items-center mx-3">
                    <div>{firstMbti}</div>
                    <MbtiSelector
                      defaultMbti={firstMbti}
                      setDefaultMbti={setFirstMbti}
                    />
                  </div>
                  <div>
                    <div className="w-full">
                      <AnswerList
                        mbti={firstMbti}
                        date={currentDate.toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full border flex flex-col border-3 basis-1/2 items-center p-3">
                  <div className="w-3/4 flex flex-col justify-center items-center mx-3">
                    <div>{secondMbti}</div>
                    <MbtiSelector
                      defaultMbti={secondMbti}
                      setDefaultMbti={setSecondMbti}
                    />
                  </div>
                  <div>
                    <AnswerList
                      mbti={secondMbti}
                      date={currentDate.toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full text-center mt-5">
              로그인을 하시면 더 많은 답변을 보실 수 있습니다!
            </div>
          </>
        )}
      </Layout>
      <Footer />
    </>
  );
}
