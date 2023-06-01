import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/firebase/index.js';

export default function askMBTI() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mbti, setMbti] = useState(["", "", "", ""]);
  const [confirmChange, setConfirmChange] = useState(false);

  const handleButtonChange = (value, index) => {
    if(mbti[index] === value){
      const newMbti = [...mbti];
      newMbti[index] = "";
      setMbti(newMbti);
    } else {
      const newMbti = [...mbti];
      newMbti[index] = value;
      setMbti(newMbti);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mbti.every(Boolean)) {
      alert("MBTI를 모두 선택해주세요!");
      return;
    }
    const finalMbti = mbti.join("");
    if (session) {
      await updateUserMbti(session.user.id, finalMbti);
    }
    router.push("askFirstQuestion");
  };

  const updateUserMbti = async (userId, mbti) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { mbti }, { merge: true });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
        <h2 className="text-center font-bold mb-4">Q. 당신의 MBTI는 무엇인가요?</h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            className={`p-1 ${mbti[0] === 'E' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('E', 0)}
          >
            E
          </button>
          <button
            className={`p-1 ${mbti[1] === 'N' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('N', 1)}
          >
            N
          </button>
          <button
            className={`p-1 ${mbti[2] === 'F' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('F', 2)}
          >
            F
          </button>
          <button
            className={`p-1 ${mbti[3] === 'J' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('J', 3)}
          >
            J
          </button>
          <button
            className={`p-1 ${mbti[0] === 'I' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('I', 0)}
          >
            I
          </button>
          <button
            className={`p-1 ${mbti[1] === 'S' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('S', 1)}
          >
            S
          </button>
          <button
            className={`p-1 ${mbti[2] === 'T' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('T', 2)}
          >
            T
          </button>
          <button
            className={`p-1 ${mbti[3] === 'P' ? 'bg-blue-500 text-white' : 'border border-blue-500'}`}
            onClick={() => handleButtonChange('P', 3)}
          >
            P
          </button>
        </div>
        <button
          className="w-full p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
          onClick={handleSubmit}
        >
          Continue
        </button>
      </div>
      {confirmChange && 
        <div>
          <p>MBTI가 이미 설정되어 있습니다. 변경하시겠습니까?</p>
          <button onClick={() => handleConfirmChange(true)}>Yes</button>
          <button onClick={() => handleConfirmChange(false)}>No</button>
        </div>
      }
    </div>
  );
}