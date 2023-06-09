import { dummy_user } from "@/data/dummy_user";

const FollowingUsers = () => {
  const user = dummy_user.find((item) => item.id === 1);

  const followingUsers = dummy_user.filter((item) =>
    user.following.includes(item.id)
  );
  console.log(followingUsers);

  return (
    <div className="flex flex-wrap">
        {followingUsers.map((user) => (
          <>
          <div className="m-5 p-3 bg-lime-200 flex flex-col items-center rounded-xl">
            <div className="bg-neutral-100 w-20 h-20 m-3">사진</div>
            <div key={user.id}>{user.name}</div>
            <div key={user.id}>{user.mbti}</div>
          </div>
          </>
        ))}
      </div>
  );
};

export default FollowingUsers;