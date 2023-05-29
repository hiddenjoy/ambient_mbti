import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex justify-center h-screen">
      <div className="grid m-auto text-center">
        <div className="m-4">Please log in</div>
        <button
          className={`w-40
                    justify-self-center
                    p-1 mb-4
                  bg-blue-500 text-white
                    border border-blue-500 rounded
                  hover:bg-white hover:text-blue-500`}
          onClick={() => signIn('credentials', { callbackUrl: '/auth/signedin' })} // Set callbackUrl to home ('/')
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
