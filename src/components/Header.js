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
      <div className="flex flex-col justify-between pl-3 py-3 sticky text-black w-1/6 mr-0 my-3 ml-5px">
        <div className="flex flex-col">
          <button className="text-xl font-bold text-center text-primary">
            <Link href="/">Ambient MBTI</Link>
          </button>
          <button className="font-bold text-center text-gray-400">
            <Link href="/compare">MBTI vs. MBTI</Link>
          </button>
        </div>

        {isLogin ? (
          <div className="flex flex-col">
            <button
              onClick={() => signOut()}
              className="smallbutton text-center text-primary p-1"
            >
              로그아웃
            </button>
            <button className="smallbutton text-center text-primary p-1">
              <Link href="/my-page">마이페이지</Link>
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <button className="smallbutton text-center text-primary p-1">
              <Link href="./auth/login">로그인</Link>
            </button>
            <button className="smallbutton text-center text-primary  p-1">
              <Link href="./auth/signin">회원가입</Link>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
