const UserProfile = ({ user }) => {
  if (!user) {
    return null;
  }
  
  const representativeQuestion = "나를 대표하는 질문";
  const answer = "질문에 대한 답변";

  return (
    <div className="p-3 bg-blue-200 flex flex-col">
      <div className="flex items-center mr-4">
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-bold">{user.name}</h2>
        <p className="text-lg">MBTI: {user.mbti}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold mb-1">{representativeQuestion}</h3>
        <p className="text-gray-800">{answer}</p>
      </div>
    </div>
  );
};

export default UserProfile;