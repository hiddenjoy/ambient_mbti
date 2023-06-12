import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";

const userCollection = collection(db, "users");

const UserProfile = ({ profiledUserId }) => {
  const { data } = useSession();
  const [profiledUser, setProfiledUser] = useState();

  //팔로잉
  const [following, setFollowing] = useState();
  const [followerNum, setFollowerNum] = useState();
  const [followingNum, setFollowingNum] = useState();

  const findProfiledUser = async () => {
    if (profiledUserId) {
      const profiledUserRef = doc(db, "users", profiledUserId);
      const querySnapshot = await getDoc(profiledUserRef);
      const users = querySnapshot.data();

      if (querySnapshot.exists()) {
        setProfiledUser(users);
      }

      //최초 팔로잉 가져오기
      setFollowing(
        Boolean(
          users.followerId && users.followerId.find((i) => i === data.user.id)
        )
      );
      setFollowerNum(users.followerId ? users.followerId.length : 0);
      setFollowingNum(users.followingId ? users.followingId.length : 0);
    }
  };

  useEffect(() => {
    findProfiledUser();
  }, [profiledUserId]);

  if (!profiledUser) {
    return null;
  }

  //팔로잉
  const handleFollowing = () => {
    updateFollow();
  };

  const handleUnFollowing = () => {
    unFollow();
  };

  const updateFollow = async () => {
    //사용자 데이터 참조
    const userRef = doc(userCollection, data.user.id);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    //anotherUser 데이터 참조
    const profiledUserRef = doc(userCollection, profiledUserId);
    const profiledUserSnapshot = await getDoc(profiledUserRef);
    const profiledUserData = profiledUserSnapshot.data();

    const updatedFollowingId = [
      ...(userData.followingId || []),
      profiledUserRef.id,
    ];
    await updateDoc(userRef, { followingId: updatedFollowingId });

    const updatedFollwerId = [
      ...(profiledUserData.followerId || []),
      userRef.id,
    ];
    await updateDoc(profiledUserRef, { followerId: updatedFollwerId });

    const updatedUserSnapshot = await getDoc(profiledUserRef);
    const updatedUserData = updatedUserSnapshot.data();
    console.log(updatedUserData);

    setFollowing(!following);
    setFollowerNum(
      updatedUserData.followerId ? updatedUserData.followerId.length : 0
    );
  };

  const unFollow = async () => {
    //사용자 데이터 참조
    const userRef = doc(userCollection, data.user.id);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    //anotherUser 데이터 참조
    const profiledUserRef = doc(userCollection, profiledUserId);
    const profiledUserSnapshot = await getDoc(profiledUserRef);
    const profiledUserData = profiledUserSnapshot.data();

    const updatedFollowingId = userData.followingId.filter(
      (id) => id !== profiledUserId
    );
    await setDoc(userRef, { followingId: updatedFollowingId }, { merge: true });

    const updatedFollwerId = profiledUserData.followerId.filter(
      (id) => id !== data.user.id
    );
    await setDoc(
      profiledUserRef,
      { followerId: updatedFollwerId },
      { merge: true }
    );

    // 업데이트된 데이터 다시 가져오기
    const updatedUserSnapshot = await getDoc(profiledUserRef);
    const updatedUserData = updatedUserSnapshot.data();
    console.log(updatedUserData);

    setFollowing(!following);
    setFollowerNum(
      updatedUserData.followerId ? updatedUserData.followerId.length : 0
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 h-[60vh]">
      <img
        className="w-32 h-32 rounded-full mx-auto"
        src={`/images/MBTIcharacters/${profiledUser.mbti}.png`}
        alt={`${profiledUser.mbti} character`}
      />
      <h2 className="text-center text-2xl font-semibold mt-3">
        {profiledUser.name}
      </h2>
      <p className="text-center text-gray-600 mt-1">{profiledUser.mbti}</p>
      <div className="text-center text-gray-600 mt-1">
        팔로워 : {followerNum}
      </div>
      <div className="text-center text-gray-600 mt-1">
        팔로잉 : {followingNum}
      </div>
      <div className="flex justify-center mt-5"></div>
      {data.user.id === profiledUserId ? (
        <></>
      ) : (
        <div className="flex flex-col mb-5">
          {following ? (
            <button
              onClick={handleUnFollowing}
              className="border m-0 mt-5 p-1 rounded-xl"
            >
              팔로잉 취소
            </button>
          ) : (
            <button
              onClick={handleFollowing}
              className="bg-neutral-200 m-0 p-1 mt-5 rounded-xl"
            >
              팔로우
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
