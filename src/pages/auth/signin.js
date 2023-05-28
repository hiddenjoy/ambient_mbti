import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mbti, setMbti] = useState("");

  async function updateUserMbti(uid, mbti, name) {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      await updateDoc(userRef, { mbti, name });
    } else {
      await setDoc(userRef, { uid, mbti, name });
    }

    // Force session update after modifying the user document
    signIn("credentials", { callbackUrl: "/auth/signedin" });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (session) {
      await updateUserMbti(session.user.id, mbti, session.user.name);
    }
  };

  return (
    <div className="flex justify-center h-screen">
      {session ? (
        <div className="grid m-auto text-center">
          {!session.user.mbti ? (
            <>
              <div className="m-4">당신의 MBTI를 입력해주세요!</div>
              <form onSubmit={handleSubmit}>
                <select
                  id="mbti"
                  name={mbti}
                  onChange={(e) => setMbti(e.target.value)}
                >
                  <option value="ISTJ">ISTJ</option>
                  <option value="ISFJ">ISFJ</option>
                  <option value="INTJ">INTJ</option>
                  <option value="INFJ">INFJ</option>
                  <option value="ISTP">ISTP</option>
                  <option value="ISFP">ISFP</option>
                  <option value="INTP">INTP</option>
                  <option value="INFP">INFP</option>
                  <option value="ESTP">ESTP</option>
                  <option value="ESFP">ESFP</option>
                  <option value="ENTP">ENTP</option>
                  <option value="ENFP">ENFP</option>
                  <option value="ENTP">ESTJ</option>
                  <option value="ENFP">ESFJ</option>
                  <option value="ENTP">ENTJ</option>
                  <option value="ENFP">ENFJ</option>
                </select>
                <button
                  type="submit"
                  className={`w-40
                    justify-self-center
                    p-1 mt-4
                    bg-blue-500 text-white
                    border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
                >
                  Submit
                </button>
              </form>
            </>
          ) : (
            router.push("/auth/signedin")
          )}
        </div>
      ) : (
        <div className="grid m-auto text-center">
          <div className="m-4">Not signed in</div>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                    bg-blue-500 text-white
                      border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
