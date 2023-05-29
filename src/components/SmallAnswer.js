const SmallAnswer = (answer) => {
  console.log("smallanswer", answer);
  return (
    <div className="bg-lime-100 p-2">
      <div>답변내용 mbti: {answer.answer.content}</div>
      <div>답변자 mbti: {answer.answer.user.mbti}</div>
      <div>좋아요 수: {answer.answer.likeUsers.length}</div>
    </div>
  );
};

export default SmallAnswer;
