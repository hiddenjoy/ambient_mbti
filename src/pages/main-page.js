import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import SmallAnswerList from "../components/SmallAnswerList";
import { answer } from "@/data/answer.js";
import AnswerList from "../components/AnswerList";
import TempAnswerList from "@/components/tempAnswerList";
import Question from "@/components/Question";
import MbtiSelector from "@/components/mbtiSelector";
import { is } from "date-fns/locale";



const Main = ({ isAnsweredToday }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answerList, setAnswerList] = useState([]);
  const [mbti, setMbti] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedDate = new Date(
    currentDate.getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          setIsLoggedIn(true);
          setMbti(userDoc.data().mbti);
        }
      }
    }

    fetchUser();
  }, [session]);

  return (
    <>
      {/* 랜덤한 답변 보여주기 */}
      {isLoggedIn ? (
        <>
          <div className="flex flex-row items-center h-full">
            <div className=" basis-1/3 flex h-full flex-col  items-center">
              <div className="mb-10 border-4 bg-neutral-100 w-full">
                <Question
                  isAnsweredToday={isAnsweredToday}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              </div>
              <div className="border-2 border-primary mr-0 w-full">
                <MbtiSelector defaultMbti={mbti} setDefaultMbti={setMbti} />
              </div>
            </div>

            <div className="flex flex-col items-center basis-2/3 px-10 w-full">
              {/* content 이 부분은 한번에 렌더링 할거긴 함 */}

              <AnswerList mbti={mbti} date={formattedDate} />
            </div>
          </div>
        </>
      ) : (
        <>


< div className >
<div className="flex flex-row items-center h-full">
  <div className="basis-1/3 flex h-full flex-col items-end">
 
  </div>
  <div className="basis-1/2 flex h-full flex-col items-center ">
    <div className=" w-full ">
      <div className="w-full mt-10 mb-10 items-center" >
        <img
          src="/images/Amber.png"
          alt="로그인 전 이미지"
          style={{
            maxWidth: '40%',
            height: 'auto',
            maxHeight: 'auto',
            display: 'block',
            top: '50%',
            transform: 'translateY(10%)',
            marginTop : '20% auto',
            marginLeft : '10%',
            marginTop : '25%'


          }}
        />
           <div className="basis-1/2 mb-5 w-full text-center mt-5  "
           style={{
            marginLeft : '-17%',
            marginTop : '6%',
            display : 'block',
            fontWeight : 'bold',
            fontSize : '20px',
            color : '#',
            whiteSpace : 'nowrap'

           }}
           >
      로그인 해주세요!
    </div>

    <div className = "basis-1/2 mb-1 w-full text-center mt-1 textAlign:'center'"
    style={{
      marginLeft : '-17%',
      display : 'block',
      fontWeight : 'regular',
      marginRight : '-17%',
      fontSize : '14px',
      color : '#6D6E71',
      whiteSpace : 'nowrap'
      
    }}
    >
      로그인하여 당신의 이야기를 들려주세요!
    </div>


      </div>
    </div>
  </div>
</div>
</div>


        </>
      )}
    </>
  );
};
export default Main;
