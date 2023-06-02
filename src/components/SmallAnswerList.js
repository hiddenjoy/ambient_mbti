const SmallAnswerList = ({ key, answer }) => {
  return (
    <div className="my-2 bg-lime-100 p-3 w-full rounded">
      <div>답변: {answer.content}</div>
      <div>답변자 mbti: {answer.user.mbti}</div>
      <div>❤️{answer.likeUsers.length}</div>
    </div>
  );
};

export default SmallAnswerList;
