import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from '@/firebase/index.js';

export default function AskName() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const saveName = async () => {
    if (session) {
      const userRef = doc(db, 'users', session.user.id);
      await setDoc(userRef, { name }, { merge: true });
    } else {
      console.error("사용자 세션이 없습니다. 로그인을 먼저 해주세요.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
        <h2 className="text-center font-bold mb-4">
          Q. 당신의 이름은 무엇인가요?
        </h2>
        <input
          type="text"
          className="w-full p-1 border-transparent rounded mb-4"
          placeholder="Your name..."
          onChange={handleNameChange}
          value={name}
        />
        <button
          className="w-full p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
          onClick={() => {
            saveName();
            router.push("askMBTI");
          }}
          disabled={!name}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
