import Link from "next/link";
import { db } from "@/firebase/index.js";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [userEmailExists, setUserEmailExists] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [passwordChecked, setPasswordChecked] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleEmailInputChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setUserPassword(e.target.value);
    checkUserPassword(e.target.value);
    setPasswordTouched(true); 
  };
  
  const checkUserEmail = async () => {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setUserEmailExists(false);
      setEmailChecked(true);
    } else {
      setUserEmailExists(true);
    }
  };

  const checkUserPassword = async () => {
    if (userPassword.length >= 8) {
      setPasswordChecked(true);
    } else {
      setPasswordChecked(false);
    }
  };

  const validateEmail = () => {
    var re = /\S+@\S+\.\S+/;
    return re.test(userEmail);
  }

  const createUser = async (email, password) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
      }
      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  const createUserAccount = async () => {
    if (validateEmail(userEmail) && emailChecked && !userEmailExists && passwordChecked) {
      try {
        const result = await createUser(
          userEmail,
          userPassword
        );
        if (!result.error) {
          setSignupSuccess(true);
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            setSignupError("이미 등록된 이메일입니다.");
          } else if (error.code === "auth/invalid-email") {
            setSignupError("유효하지 않은 이메일입니다.");
          } else if (error.code === "auth/operation-not-allowed") {
            setSignupError("이메일/비밀번호 인증이 Firebase에 활성화되지 않았습니다.");
          } else if (error.code === "auth/weak-password") {
            setSignupError("비밀번호가 너무 약합니다.");
          } else {
            setSignupError("회원가입 중에 오류가 발생했습니다. 다시 시도해주세요.");
            console.error(error);
          }
      }
    } else {
      if (!validateEmail(userEmail)) {
        setSignupError("이메일 형식이 맞지 않습니다.");
      } else if (userEmailExists) {
        setSignupError("이미 등록된 이메일입니다.");
      } else if (userPassword.length < 8) {
        setSignupError("비밀번호는 최소 8자리 이상이어야 합니다.");
      }
    }
  };

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {signupSuccess ? (
        // 회원가입이 성공한 경우 표시될 UI
        <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4 text-center">
          <h2 className="text-center font-bold mb-4">회원가입이 성공적으로 완료되었습니다</h2>
          <button
            className="p-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
            onClick={handleLoginClick}
          >
            Log In
          </button>
        </div>
      ) : (
        // 회원가입 진행 중 표시될 UI
        <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
            <h2 className="text-center font-bold mb-4">Create your account</h2>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    className={`flex-grow mr-2 p-1 ${
                    userEmailExists ? "border-red-500" : "border-transparent"
                    } rounded`}
                    placeholder="Your Email"
                    onChange={handleEmailInputChange}
                    value={userEmail}
                    style={{ height: "35px" }}
                />
                <button
                    className="p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
                    onClick={checkUserEmail}
                >
                    중복확인
                </button>
            </div>
            {emailChecked && !userEmailExists && (
            <div className="text-green-500 text-sm mb-4">
            사용가능한 이메일입니다!
            </div>
            )}
            {userEmailExists && (
            <div className="text-red-500 text-sm mb-4">
            중복되는 이메일이 존재합니다. 다른 이메일을 시도해보세요!
            </div>
            )}
            {signupError && (
            <div className="text-red-500 text-sm mb-4">
            {signupError}
            </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    className={`flex-grow mr-2 p-1 ${
                    passwordChecked ? "border-red-500" : "border-transparent"
                    } rounded`}
                    placeholder="Your Password"
                    onChange={handlePasswordInputChange}
                    value={userPassword}
                    style={{ height: "35px" }}
                />
            </div>
            {passwordChecked && (
            <div className="text-green-500 text-sm mb-4">
            사용가능한 비밀번호입니다!
            </div>
            )}
            {!passwordChecked && passwordTouched && (
            <div className="text-red-500 text-sm mb-4">
            비밀번호는 8자리 이상이어야 합니다!
            </div>
            )}
            <button
                className={`w-full p-1 text-white border border-blue-500 rounded ${
                validateEmail(userEmail) && emailChecked && !userEmailExists && passwordChecked
                    ? "bg-blue-500"
                    : "bg-gray-300 pointer-events-none"
                }`}
                onClick={createUserAccount}
            >
            Sign Up
            </button>
            <div className="flex justify-center items-center my-4">
                <hr className="w-1/4" />
                <span className="mx-2">or</span>
                <hr className="w-1/4" />
            </div>
            <button
                className="w-full p-1 bg-yellow-300 text-black border border-yellow-300 rounded hover:bg-white hover:text-yellow-300"
                onClick={() =>
                signIn("kakao", { callbackUrl: "/auth/askName" })  // "credentials" -> "kakao"
                }
            >
                Sign up with Kakao
            </button>
            <div>
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-500 hover:underline">
                    Log in here
                </Link>
            </div>
        </div>
      )}
    </div>
  );
}
