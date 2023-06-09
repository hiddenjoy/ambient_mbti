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

const UserProfile = ({ profiledUserId, profiledUserName, profiledUserMbti }) => {  
  const { data } = useSession();
  const [ followerNum, setFollowerNum ] = useState();

  const [ profiledUser, setProfiledUser ] = useState();

  const findProfiledUser = async () => {
    const userRef = doc(userCollection, profiledUserId);
    const querySnapshot = await getDoc(userRef);
    const users = querySnapshot.data();

    setProfiledUser(users);
  };

  useEffect(() => {
    findProfiledUser();
  }, [profiledUserId]);


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
