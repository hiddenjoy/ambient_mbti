import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase/index.js';
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userIdExists, setUserIdExists] = useState(true);
  const [passwordCorrect, setPasswordCorrect] = useState(true);

  const handleIdInputChange = (e) => {
    setUserId(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setUserPassword(e.target.value);
  };

  const login = async () => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      setUserIdExists(false);
      setPasswordCorrect(true);
    } else if (userSnap.data().userPassword !== userPassword) {
      setPasswordCorrect(false);
      setUserIdExists(true);
    } else {
      setPasswordCorrect(true);
      setUserIdExists(true);
      // Proceed to next page or do something after login
      router.push('/auth/success');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
        <h2 className="text-center font-bold mb-4">Welcome back!</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className={`flex-grow mr-2 p-1 ${!userIdExists ? 'border-red-500' : 'border-transparent'} rounded`}
            placeholder="ID"
            onChange={handleIdInputChange}
            value={userId}
            style={{ height: '35px' }}
          />
          {!userIdExists && <div className="text-red-500 text-sm mb-4">아이디가 존재하지 않습니다.</div>}
        </div>
        <div className="flex justify-between items-center mb-4">
          <input
            type="password"
            className={`flex-grow mr-2 p-1 ${!passwordCorrect ? 'border-red-500' : 'border-transparent'} rounded`}
            placeholder="Password"
            onChange={handlePasswordInputChange}
            value={userPassword}
            style={{ height: '35px' }}
          />
          {!passwordCorrect && <div className="text-red-500 text-sm mb-4">비밀번호가 올바르지 않습니다</div>}
        </div>
        <button
          className={`w-full p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500`}
          onClick={login}
        >
          Log in
        </button>
        <div className="flex justify-center items-center my-4">
          <hr className="w-1/4" />
          <span className="mx-2">or</span>
          <hr className="w-1/4" />
        </div>
        <button
          className="w-full p-1 bg-yellow-300 text-black border border-yellow-300 rounded hover:bg-white hover:text-yellow-300"
          onClick={() => signIn()}
        >
          Log in with Kakao
        </button>
        <div>
          Don't have an account? 
          <Link href="/auth/signin" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
