import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-lime-200 p-3 sticky top-0">
        <Link href="/" className="text-3xl font-bold text-center text-primary">
          Ambient <br />
          MBTI
        </Link>
        <Link
          href="/my-page"
          className="text-2xl font-bold text-center text-secondary"
        >
          마이페이지
        </Link>
      </div>
    </>
  );
};

export default Header;
