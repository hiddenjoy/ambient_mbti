import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-between bg-lime-200 p-3 sticky top-0">
        <Link href="/" className="text-3xl font-bold text-center text-primary">
          Ambient <br />
          MBTI
        </Link>
        <Link
          href="/my_page"
          className="text-2xl font-bold text-center text-secondary"
        >
          마이페이지
        </Link>
      </div>
      <main className="flex min-h-screen flex-col items-center">
        {/* 질문 */}
        <div className="bg-neutral-300 w-full flex flex-col items-center">
          <div className="w-3xl p-5 bg-lime-100 rounded-3xl">
            <h1 className="text-xl font-bold mb-3">오늘의 질문</h1>
            <p className="text-center">
              당신이 가장 당신다워지는 순간은 언제인가요?
            </p>
          </div>
        </div>
        {/* 랜덤한 답변 보여주기 */}
        <div className="bg-white w-full p-5">
          <h1>다른 사람들은 어떻게 대답했을까요?</h1>
          {/* 답변들 div */}
          <div className="mt-3 px-20 flex items-center justify-between">
            {/* content 이 부분은 한번에렌더링 할거긴 함 */}
            <div className="bg-lime-100">이런저런</div>
            <div className="bg-lime-100">이런저런</div>
            <div className="bg-lime-100">이런저런</div>
          </div>
        </div>
        {/* mbti별 인기 답변 */}
        <div className="bg-neutral-200 w-full p-5">
          MBTI별 인기 답변
          <div className="mt-3 grid grid-cols-4 gap-4">
            <div className="bg-lime-100">01</div>
            <div className="bg-lime-100">02</div>
            <div className="bg-lime-100">03</div>
            <div className="bg-lime-100">04</div>
            <div className="bg-lime-100">05</div>
            <div className="bg-lime-100">06</div>
            <div className="bg-lime-100">07</div>
            <div className="bg-lime-100">08</div>
            <div className="bg-lime-100">09</div>
            <div className="bg-lime-100">10</div>
            <div className="bg-lime-100">11</div>
            <div className="bg-lime-100">12</div>
            <div className="bg-lime-100">13</div>
            <div className="bg-lime-100">14</div>
            <div className="bg-lime-100">15</div>
            <div className="bg-lime-100">16</div>
          </div>
        </div>
        <Link
          href="/compare"
          className="text-2xl font-bold text-center text-secondary"
        >
          MBTI 별로 비교
        </Link>
      </main>
    </>
  );
}
