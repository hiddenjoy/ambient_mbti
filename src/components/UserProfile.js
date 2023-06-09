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
  // const { data } = useSession();

  const [ followerNum, setFollowerNum ] = useState();
  const [ followingNum, setFollowingNum ] = useState();

  const [profiledUser, setProfiledUser] = useState();


  const findProfiledUser = async () => {
    if (profiledUserId) {
      const userRef = doc(db, "users", profiledUserId);
      const querySnapshot = await getDoc(userRef);
      const users = querySnapshot.data();

      if (querySnapshot.exists()) {
        setProfiledUser(users);
        console.log(users);
      }
    }

    // const collectionRef = collection(db, 'users');
    // const querySnapshot = await getDocs(collectionRef);
    // querySnapshot.forEach((doc) => {
    //     const userData = doc.data();
    //     console.log(userData);
    // });

   
  };

  useEffect(() => {
    findProfiledUser();
  }, [profiledUserId]);

  if (!profiledUser) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-md p-5">
      <img
        className="w-32 h-32 rounded-full mx-auto"
        src={profiledUser.photoURL}
        alt="profile"
      />
      <h2 className="text-center text-2xl font-semibold mt-3">
        {profiledUser.name}
      </h2>
      <p className="text-center text-gray-600 mt-1">{profiledUser.mbti}</p>
      <div>팔로워 : {followerNum}</div>
      <div>팔로잉 : {followingNum}</div>
      <div className="flex justify-center mt-5"></div>
    </div>
  );
};

export default UserProfile;
