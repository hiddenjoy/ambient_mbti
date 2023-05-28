import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import { admins } from "@/data/admins.js";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mbti, setMbti] = useState("");
  const [confirmChange, setConfirmChange] = useState(false);

  async function updateUserMbti(uid, mbti, name) {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    // Check if the user is an admin
    const isAdmin = admins.some(
      (admin) => admin.name === name && admin.mbti === mbti
    );
    if (userSnapshot.exists()) {
      await updateDoc(userRef, { mbti, name, isAdmin });
    } else {
      await setDoc(userRef, { uid, mbti, name, isAdmin });
    }

    // Force session update after modifying the user document
    signIn("credentials", { callbackUrl: "/auth/signedin" });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if the input MBTI is valid
    const mbtiRegex = /^[I|E][S|N][T|F][J|P]$/;
    if (!mbtiRegex.test(mbti)) {
      alert("MBTI를 다시 입력해주세요!");
      setMbti("");
      return;
    }
    if (session) {
      await updateUserMbti(session.user.id, mbti, session.user.name);
    }
  };

  const handleInputChange = (e) => {
    setMbti(e.target.value.toUpperCase());
  };

  return (
    <div className="flex justify-center h-screen">
      {session ? (
        <div className="grid m-auto text-center">
          {!session.user.mbti || confirmChange ? (
            <>
              <div className="m-4">당신의 MBTI를 입력해주세요!</div>
              <form onSubmit={handleSubmit}>
                {/* <input
                  type="text"
                  className="p-1 border border-gray-300"
                  onChange={(e) => setMbti(e.target.value)}
                  value={mbti}
                /> */}
                <select
                  id="mbti"
                  name={mbti}
                  onChange={handleInputChange}
                  value={mbti}
                />
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
              {confirmChange && (
                <>
                  <div className="m-4">MBTI를 바꾸시겠습니까?</div>
                  <button
                    className={`w-20
                    justify-self-center
                    p-1 mb-4 mr-2
                    bg-blue-500 text-white
                    border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
                    onClick={() => handleConfirmChange(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`w-20
                    justify-self-center
                    p-1 mb-4 ml-2
                    bg-red-500 text-white
                    border border-red-500 rounded
                    hover:bg-white hover:text-red-500`}
                    onClick={() => handleConfirmChange(false)}
                  >
                    No
                  </button>
                </>
              )}
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
