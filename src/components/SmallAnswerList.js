const SmallAnswerList = ({ key, answer }) => {
  return (
    <div className="flex flex-col justify-center my-2 bg-primary text-tertiary p-3 w-full rounded">
      <div className=" border text-xl text-center mb-3">
        " {answer.content} "
      </div>
      <div className="text-end text-xs italic">
        by. {answer.user.mbti} {answer.user.id}
      </div>
      <div className="text-end">❤️ {answer.likeUsers.length}</div>
    </div>
  );
};

export default SmallAnswerList;
