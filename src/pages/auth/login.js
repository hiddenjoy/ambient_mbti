import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import Link from "next/link";

export default function LogIn() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailInputChange = (e) => {
    setUserEmail(e.target.value);
    setEmailError("");
    setError("");
  };

  const handlePasswordInputChange = (e) => {
    setUserPassword(e.target.value);
    setPasswordError("");
    setError("");
  };

  const handleCredentialsLogin = async () => {
    setEmailError("");
    setPasswordError("");
    setError("");

    const usersRef = collection(db, "users");
    const emailQuery = query(usersRef, where("email", "==", userEmail));
    const userSnapshot = await getDocs(emailQuery);
    
    if (userSnapshot.empty) {
      setEmailError("해당 이메일이 존재하지 않습니다.");
      return;
    }

    const userRef = doc(db, "users", userSnapshot.docs[0].id);
    const userDoc = await getDoc(userRef);

    if (userDoc.data().password !== userPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: userEmail,
        password: userPassword,
      });

      if (!result.error) {
        console.log("log in success");
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAdminMode = () => {
    router.push("/admin/admin");
  };

  useEffect(() => {
    async function fetchUser() {
      if (session && session.user && session.user.id) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
          if (!userDoc.data().name || !userDoc.data().mbti || !userDoc.data().interestedMbti) {
            //router.push("/auth/askName");
          } else {
            router.push("/");  // If login is successful, redirect to the homepage
          }
        }
      }
    }

    fetchUser();
  }, [session]);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
          <h2 className="text-center font-bold mb-4">환영합니다!</h2>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              className={`flex-grow mr-2 p-1 ${
                emailError ? "border-red-500" : "border-transparent"
              } rounded`}
              placeholder="Email"
              onChange={handleEmailInputChange}
              value={userEmail}
              style={{ height: "35px" }}
            />
            {emailError && <div className="text-red-500 text-sm mb-4">{emailError}</div>}
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="password"
              className={`flex-grow mr-2 p-1 ${
                passwordError ? "border-red-500" : "border-transparent"
              } rounded`}
              placeholder="Password"
              onChange={handlePasswordInputChange}
              value={userPassword}
              style={{ height: "35px" }}
            />
            {passwordError && <div className="text-red-500 text-sm mb-4">{passwordError}</div>}
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            className={`w-full p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500`}
            onClick={handleCredentialsLogin}
          >
            로그인
          </button>
          <div className="flex justify-center items-center my-4">
            <hr className="w-1/4" />
            <span className="mx-2">or</span>
            <hr className="w-1/4" />
          </div>
          <button
            className="w-full p-1 bg-yellow-300 text-black border border-yellow-300 rounded hover:bg-white hover:text-yellow-300"
            onClick={() =>
              signIn("kakao")
            }
          >
            카카오로 로그인
          </button>
          <div>
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              회원가입 하기
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    if (user) {
      if (!user.name || !user.mbti || !user.interestedMbti) {
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-6">성공적인 시작을 위해 3가지 질문에 답변해주세요!</h2>
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={() => router.push("/auth/askName")}
            >
              답변하러 가기
            </button>
          </div>
        );
      } else {
        return (
          <div className="flex justify-center h-screen">
            <div className="grid m-auto text-center">
              <div className="m-4">{user.mbti + " " + user.name}님 환영합니다.</div>

              {user.isAdmin && (
                <button
                  className={`w-40
                              justify-self-center
                              p-1 mb-4
                            bg-blue-500 text-white
                              border border-blue-500 rounded
                            hover:bg-white hover:text-blue-500`}
                  onClick={handleAdminMode}
                >
                  Admin Mode
                </button>
              )}
              <button
                className={`w-40
                            justify-self-center
                            p-1 mb-4
                          bg-blue-500 text-white
                            border border-blue-500 rounded
                          hover:bg-white hover:text-blue-500`}
                onClick={() => router.push("/")}
              >
                홈으로
              </button>
              <button
                className={`w-40
                            justify-self-center
                            p-1 mb-4
                          text-blue-500
                            border border-blue-500 rounded
                          hover:bg-white hover:text-blue-500`}
                onClick={() => signOut()}
              >
                로그아웃
              </button>
            </div>
          </div>
        );
      }
    } else {
      return <div>Loading...</div>;
    }
  }
}
