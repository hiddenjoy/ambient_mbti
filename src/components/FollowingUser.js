import Link from "next/link";
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
import mbtiColors from "@/data/mbtiColors.js";


const userCollection = collection(db, "users");

const FollowingUsers = () => {
  const { data } = useSession();
  const [followingUsers, setFollowingUsers] = useState([]);

  const getFollowingUsers = async () => {
    const q = query(
      userCollection,
      where("followerId", "array-contains", data.user.id)
    );
    const results = await getDocs(q);
    const getFollowingUsers = results.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFollowingUsers(getFollowingUsers);

    // console.log(getFollowingUsers);
  }

  useEffect(() => {
    getFollowingUsers();
  }, []);

  return (
    <div className="flex flex-wrap" >
      {followingUsers.length > 0 ?
      (
        followingUsers.map((user) => (
          <Link href="/anotherUser/[id]" as={`/anotherUser/${followingUsers.id}`}>
            <div className="m-5 p-3 flex flex-col items-center rounded-xl"
              style={{backgroundColor: mbtiColors[user.mbti]}}
            >
              <div className="bg-neutral-100 w-20 h-20 m-3">사진</div>
              <div key={user.id}>{user.name}</div>
              <div key={user.id}>{user.mbti}</div>
            </div>
          </Link>
        ))
      ) : (
        <div>팔로워가 없습니다 ㅠㅠ</div>
      )}
      </div>
  );
};

export default FollowingUsers;