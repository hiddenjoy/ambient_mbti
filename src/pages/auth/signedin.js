import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

export default function SignedIn() {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

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

  const handleAdminMode = () => {
    router.push("/admin/admin");
  };

  return (
    <div className="flex justify-center h-screen">
      {user && user.mbti ? (
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
            Go to Home
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
            Sign out
          </button>
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
