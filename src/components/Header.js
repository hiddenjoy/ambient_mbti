import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-lime-200 p-3 sticky top-0 text-black">
        <Link
          href="/"
          className="text-3xl font-bold text-center text-primary border-4 ml-4 p-3"
        >
          Ambient <br />
          MBTI
        </Link>
        <div>
          <Link
            href="/my-page"
            className="text-2xl font-bold text-center text-secondary border-4 ml-4 p-3"
          >
            로그인
          </Link>
          <Link
            href="/my-page"
            className="text-2xl font-bold text-center text-secondary border-4 ml-4 p-3"
          >
            마이페이지
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
