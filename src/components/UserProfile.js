const UserProfile = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-5">
      <img className="w-32 h-32 rounded-full mx-auto" src="{user.photoURL}" alt="profile" />
      <h2 className="text-center text-2xl font-semibold mt-3">{user.name}</h2>
      <p className="text-center text-gray-600 mt-1">{user.mbti}</p>
      <div className="flex justify-center mt-5">
        <a href="#" className="text-blue-500 hover:text-blue-700 mx-2">팔로잉</a>
        <a href="#" className="text-blue-500 hover:text-blue-700 mx-2">팔로우</a>
      </div>
      <div className="mt-5">
        <h3 className="text-center font-semibold mt-1">가장 나다운 순간은</h3>
        <p className="text-center text-gray-600 mt-2">"바로 지금"</p>
      </div>
    </div>
  );
};

export default UserProfile;
