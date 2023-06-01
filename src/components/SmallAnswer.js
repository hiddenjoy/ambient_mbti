const SmallAnswer = (answer) => {
  console.log("smallanswer", answer);
  return (
    <div className="m-2 bg-lime-100 p-2">
      <div>답변: {answer.answer.content}</div>
      <div>답변자 mbti: {answer.answer.user.mbti}</div>
      <div>❤️{answer.answer.likeUsers.length}</div>
    </div>
  );
};

export default SmallAnswer;
