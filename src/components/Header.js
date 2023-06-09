import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

const Header = ({ whichPage }) => {
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
      <div className="flex flex-col justify-between pl-3 py-3 sticky text-black mr-0 my-3 ml-5px w-40">
        <div className="flex flex-col items-end">
          <Link href="/ranking">
            {whichPage === "ranking" ? (
              <button className="banner w-40 text-xl font-bold text-center text-primary">
                Ambient MBTI
              </button>
            ) : (
              <button className="banner w-32 text-l text-center text-primary bg-gray-200">
                Ambient MBTI
              </button>
            )}
          </Link>

          <Link href="/">
            {whichPage === "main" ? (
              <button className="banner w-40 text-xl font-bold text-center text-primary">
                Today
              </button>
            ) : (
              <button className="banner w-32 text-l text-center text-primary bg-gray-200">
                Today
              </button>
            )}
          </Link>

          <Link href="/compare">
            {whichPage === "compare" ? (
              <button className="banner w-40 text-xl font-bold text-center text-primary">
                MBTI vs. MBTI
              </button>
            ) : (
              <button className="banner w-32 text-l text-center text-primary bg-gray-200">
                MBTI vs. MBTI
              </button>
            )}
          </Link>
        </div>

        {isLogin ? (
          <div className="flex flex-col items-center">
            <button
              onClick={() => signOut()}
              className="smallbutton text-center text-primary"
            >
              로그아웃
            </button>
            <Link href="/my-page">
              <button className="smallbutton text-center text-primary">
                마이페이지
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            <button className="smallbutton text-center text-primary">
              <Link href="./auth/login">로그인</Link>
            </button>
            <button className="smallbutton text-center text-primary">
              <Link href="./auth/signup">회원가입</Link>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
