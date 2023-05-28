import Link from "next/link";

const Header = () => {
  let isLogin = false;
  return (
    <>
      <div className="flex items-center justify-between bg-lime-200 p-3 sticky top-0 text-black">
        <Link
          href="/"
          className="text-xl font-bold text-center text-primary border-4 ml-4 p-3"
        >
          Ambient MBTI
        </Link>
        <div>
          {isLogin ? (
            <div>
              <Link
                href="./auth/signin"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                로그아웃
              </Link>
              <Link
                href="/my-page"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                마이페이지
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="./auth/signin"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                로그인
              </Link>
              <Link
                href="/my-page"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
