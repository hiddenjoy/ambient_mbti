const Question = () => {
  return (
    <div className="bg-neutral-300 w-full flex flex-col items-center p-5 text-black">
      <div className="w-3xl p-5 bg-lime-100 rounded-3xl">
        <h1 className="text-xl font-bold mb-3">오늘의 질문</h1>
        <p className="text-center">
          {/* {user?.name}님이 가장 '나'다워지는 순간은 언제인가요? */}
          가장 '나'다워지는 순간은 언제인가요?
        </p>
        <div className="flex ">
          <input
            className="w-full p-2 mt-3 border-2 border-neutral-400 rounded-lg"
            placeholder="답변을 입력해주세요"
          ></input>
          <button type="submit" className="w-1/5 p-2 mt-3 border-2">
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question;
