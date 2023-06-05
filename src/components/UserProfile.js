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

const UserProfile = ({ profiledUser, profiledUserName, profiledUserMbti }) => {  
  const { data } = useSession();
  // const [ following, setFollowing ] = useState();

  const [followingUser, setFollowingUser] = useState();

  const findFollowingUser = async () => {
    if (profiledUser) {
      const q = query(
        userCollection,
        where("name", "==", profiledUser.name),
        where("mbti", "==", profiledUser.mbti)
      );
    }

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => doc.data());

    setFollowingUser(users);
    console.log(profiledUser);
  };

  useEffect(() => {
    // findFollowingUser();
    console.log(profiledUser);
  }, [profiledUser]);

  const handleFollowing = () => {
    // updateFollowing();
    // updateFollower();
  }
  
  const updateFollowing = async () => {
    const userRef = doc(userCollection, data.user.id);
    if(data.user.followingId){
      const updatedFollowing = [...data.user.followingId, followingUser.id]
      await updateDoc(userRef, { followingId: updatedFollowing });
    } else {
      await setDoc(userRef, {followingId: [followingUser.id] }, {merge: true})
    }
  };

  const updateFollower = async () => {
    const userRef = doc(userCollection, followingUser.id);
    if(data.user.followingId){
      const updatedFollower = [...followingUser.followerId, data.user.id]
      await updateDoc(userRef, { followerId: updatedFollower });
    } else {
      await setDoc(userRef, { followerId: [data.user.id] }, {merge: true})
    }
  };

  if (!profiledUser) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-5">
      <img className="w-32 h-32 rounded-full mx-auto" src={profiledUser.photoURL} alt="profile" />
      <h2 className="text-center text-2xl font-semibold mt-3">{profiledUser.name}</h2>
      <p className="text-center text-gray-600 mt-1">{profiledUser.mbti}</p>
      <div className="flex justify-center mt-5">
        <a href="#" className="text-blue-500 hover:text-blue-700 mx-2">팔로잉</a>
        <a href="#" className="text-blue-500 hover:text-blue-700 mx-2">팔로우</a>
      </div>
    </div>
  );
};

export default UserProfile;
