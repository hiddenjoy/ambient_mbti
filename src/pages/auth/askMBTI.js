import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/firebase/index.js';

export default function askMBTI() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mbti, setMbti] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [confirmChange, setConfirmChange] = useState(false);
  
  const handleInputChange = (e) => {
    setMbti(e.target.value.toUpperCase());
    checkMBTI(e.target.value.toUpperCase());
  };
  
  const checkMBTI = (inputMBTI) => {
    const mbtiRegex = /^[I|E][S|N][T|F][J|P]$/;
    if (mbtiRegex.test(inputMBTI)) {
        setIsValid(true);
        console.log("is Valid")
    } else {
        setIsValid(false);
        console.log("is inValid")
    }
    
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if the input MBTI is valid
    if (!isValid) {
      alert("MBTI를 다시 입력해주세요!");
      setMbti("");
      return;
    }
    if (session) {
      await updateUserMbti(session.user.id, mbti);
    }
    router.push("askFirstQuestion")
  };

  async function updateUserMbti(uid, mbti) {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists() && userSnapshot.data().mbti !== mbti) {
      // If user's existing mbti is different than the entered one,
      // prompt for confirmation to change.
      setConfirmChange(true);
      return;
    }

    if (userSnapshot.exists()) {
      await updateDoc(userRef, { mbti });
    } else {
      await setDoc(userRef, { uid, mbti });
    }
  }

  const handleConfirmChange = async (change) => {
    if (change) {
      // Update MBTI if user confirms change
      const userRef = doc(db, "users", session.user.id);
      await updateDoc(userRef, { mbti });
    } else {
      // Reset MBTI input if user denies change
      setMbti("");
    }
    // Reset confirmChange state
    setConfirmChange(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
        <h2 className="text-center font-bold mb-4">Q. 당신의 MBTI는 무엇인가요?</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className="flex-grow mr-2 p-1 border-transparent rounded"
            placeholder="Your MBTI"
            onChange={handleInputChange}
            value={mbti}
            style={{ height: '35px' }}
          />
        </div>
        <button
          className="w-full p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
          disabled={!isValid}
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
