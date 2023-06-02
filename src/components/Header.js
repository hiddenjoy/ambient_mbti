import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

const Header = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    }

    fetchUser();
  }, [session]);

  useEffect(() => {
    if (session) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [session]);

  return (
    <>
      <div className="flex flex-col items-center justify-between bg-lime-200 p-3 sticky top-0 text-black w-1/12 m-3">
        <div className="flex flex-col">
          <Link
            href="/"
            className="border-4 text-xl font-bold text-center text-primary m-1 p-1"
          >
            Ambient MBTI
          </Link>
          <Link
            href="/compare"
            className="border-4 font-bold text-center text-gray-400 m-1 p-1"
          >
            MBTI vs. MBTI
          </Link>
        </div>

        {isLogin ? (
          <div className="flex flex-col">
            <button
              onClick={() => signOut()}
              className="font-bold text-center text-primary border-4 m-1 p-1 text-xs"
            >
              로그아웃
            </button>
            <Link
              href="/my-page"
              className="font-bold text-center text-primary border-4 m-1 p-1 text-xs"
            >
              마이페이지
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            <Link
              href="./auth/login"
              className="font-bold text-center text-primary border-4 m-1 p-1 text-xs"
            >
              로그인
            </Link>
            <Link
              href="./auth/signin"
              className="font-bold text-center text-primary border-4 m-1 p-1 text-xs"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
