import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center text-primary">
        Ambient MBTI
      </h1>
      <Link
        href="/compare"
        className="text-2xl font-bold text-center text-secondary"
      >
        MBTI 별로 비교
      </Link>
      <Link
        href="/my_page"
        className="text-2xl font-bold text-center text-secondary"
      >
        마이페이지
      </Link>
    </main>
  );
}
