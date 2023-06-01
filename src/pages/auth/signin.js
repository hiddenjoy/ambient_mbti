import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db, signupEmail } from '@/firebase/index.js';
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setUserId] = useState("");
  const [idChecked, setIdChecked] = useState(false);
  const [userIdExists, setUserIdExists] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [passwordChecked, setPasswordChecked] = useState(false);
  
  const handleIdInputChange = (e) => {
    setUserId(e.target.value);
  };
  
  const handlePasswordInputChange = (e) => {
    setUserPassword(e.target.value);
    checkUserPassword(e.target.value);
  };

  const checkUserId = async () => {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      setUserIdExists(true);
    } else {
      setIdChecked(true);
    }
  };
  
  const checkUserPassword = async () => {
    if (userPassword.length >= 8) {
      setPasswordChecked(true);
    } else {
      setPasswordChecked(false);
    }
  };

  const saveUserId = async () => {
    if (session && !userIdExists && idChecked) {
      const userRef = doc(db, 'users', session.user.id);
      await setDoc(userRef, { userId });
    } else {
      console.error("이미 존재하는 아이디거나 중복확인을 하지 않은 아이디입니다.");
    }
  };
  
  const saveUserPassword = async () => {
    if (session && passwordChecked) {
      const userRef = doc(db, 'users', session.user.id);
      await updateDoc(userRef, { userPassword });
      router.push('/auth/askMBTI');
    } else {
      console.error("유효하지 않은 비밀번호입니다.");
    }
  };

  const saveUserAccount = async () => {
    try {
      const result = await signupEmail(userId, userPassword);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { email: user.email });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUpClick = () => {
    saveUserId();
    saveUserPassword();
    saveUserAccount();
    router.push("askName");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
        <h2 className="text-center font-bold mb-4">Create your account</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className={`flex-grow mr-2 p-1 ${userIdExists ? 'border-red-500' : 'border-transparent'} rounded`}
            placeholder="Your ID"
            onChange={handleIdInputChange}
            value={userId}
            style={{ height: '35px' }}
          />
          <button
            className="p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
            onClick={checkUserId}
          >
            중복확인
          </button>
        </div>
        {idChecked && !userIdExists && <div className="text-green-500 text-sm mb-4">사용가능한 아이디입니다!</div>}
        {userIdExists && <div className="text-red-500 text-sm mb-4">중복되는 아이디가 존재합니다. 다른 아이디를 시도해보세요!</div>}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className={`flex-grow mr-2 p-1 ${passwordChecked ? 'border-red-500' : 'border-transparent'} rounded`}
            placeholder="Your Password"
            onChange={handlePasswordInputChange}
            value={userPassword}
            style={{ height: '35px' }}
          />
        </div>
        {passwordChecked && <div className="text-green-500 text-sm mb-4">사용가능한 비밀번호입니다!</div>}
        {!passwordChecked && <div className="text-red-500 text-sm mb-4">비밀번호는 8자리 이상이어야 합니다!</div>}
        <button
          className={`w-full p-1 ${idChecked && !userIdExists && passwordChecked ? 'bg-blue-500' : 'bg-blue-200'} text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500`}
          disabled={!idChecked || userIdExists || !passwordChecked}
          onClick={handleSignUpClick}
        >
          Continue
        </button>
        <div className="flex justify-center items-center my-4">
          <hr className="w-1/4" />
          <span className="mx-2">or</span>
          <hr className="w-1/4" />
        </div>
        <button
          className="w-full p-1 bg-yellow-300 text-black border border-yellow-300 rounded hover:bg-white hover:text-yellow-300"
          onClick={() => signIn('credentials', { callbackUrl: '/auth/askName' })}
        >
          Sign in with Kakao
        </button>
        <div>
          Don't have an account? 
          <Link href="/auth/signin" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  )
}
