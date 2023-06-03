import { useRouter } from "next/router";

export default function SignInSuccess() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-center font-bold mb-4">회원가입이 성공적으로 완료되었습니다</h2>
      <button
        className="p-2 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
        onClick={handleLoginClick}
      >
        Log In
      </button>
    </div>
  );
}
