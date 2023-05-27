import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data } = useSession({
    required : true,
    onUnauthenticated() {
      router.replace("/auth/signin");
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center text-primary">
        Ambient MBTI
      </h1>
      <Link
        href="/compare"
        className="text-2xl font-bold text-center text-secondary"
      >
        MBTI 별로 비교하기
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
