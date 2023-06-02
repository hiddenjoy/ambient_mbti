import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import MbtiSelector from "../components/mbtiSelector";

export default function Compare() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [answerList, setAnswerList] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setIsLoggedIn(true);
        }
      }
    }

    fetchUser();
  }, [session]);

  return (
    <Layout>
      {isLoggedIn ? (
        <>
          <div className="flex justify-center">질문</div>

          <div className="flex flex-row">
            <div className="flex flex-col border-3 basis-1/2 items-center px-2">
              우아
              <MbtiSelector defaultMbti={"INTP"} />
            </div>
            <div className="border-3 basis-1/2 flex flex-col items-center px-2">
              우아
              <MbtiSelector defaultMbti={"ENFP"} />
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
  );
}
