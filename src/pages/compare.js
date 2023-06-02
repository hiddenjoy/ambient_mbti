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
import TempAnswerList from "../components/tempAnswerList";
import Footer from "../components/Footer";

export default function Compare() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [answerList, setAnswerList] = useState([]);
  const [firstMbti, setFirstMbti] = useState("");
  const [secondMbti, setSecondMbti] = useState("");
  const questionCollection = collection(db, "questions");
  const [question, setQuestion] = useState("");

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
    const today = new Date().toISOString().split("T")[0];

    const q = query(questionCollection, where("date", "==", today));
    const results = await getDocs(q);

    setQuestion(results.docs[0].data());
  };

  useEffect(() => {
    getQuestion();
  }, []);

  return (
    <>
      <Layout>
        {isLoggedIn ? (
          <>
            <div className="flex h-full">
              <div className="flex flex-col w-1/4 h-full items-center p-5 mb-5 border">
                <div className="flex text-gray-500 text-xs">
                  {question.date}의 질문
                </div>
                <div className="flex text-2xl text-center whitespace-normal">
                  " {question.content} "
                </div>
              </div>

              <div className="flex flex-col w-3/4">
                <div className="border flex flex-row border-3 basis-1/2 items-center p-3">
                  <div className="flex flex-col justify-center items-center w-1/4 mx-3">
                    <div>{firstMbti}</div>
                    <MbtiSelector
                      defaultMbti={firstMbti}
                      setDefaultMbti={setFirstMbti}
                    />
                  </div>
                  <div className="w-3/4">
                    <TempAnswerList num={1} />
                  </div>
                </div>
                <div className="border flex flex-row border-3 basis-1/2 items-center p-3">
                  <div className="flex flex-col justify-center items-center w-1/4 mx-3">
                    <div>{secondMbti}</div>
                    <MbtiSelector
                      defaultMbti={secondMbti}
                      setDefaultMbti={setSecondMbti}
                    />
                  </div>
                  <div className="w-3/4">
                    <TempAnswerList num={1} />
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
