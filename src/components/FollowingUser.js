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
// import ENFJ from '@/images/MBTIcharacters/ENFJ.png';


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
  }

  useEffect(() => {
    getFollowingUsers();
  }, []);

  return (
    <div className="flex flex-wrap" >
      {followingUsers.length > 0 ?
      (
        followingUsers.map((user) => (
          <Link href="/anotherUser/[id]" as={`/anotherUser/${user.id}`}>
            <div className="m-5 p-3 flex flex-col items-center rounded-xl w-32"
              style={{backgroundColor: mbtiColors[user.mbti]}}
            >
              <img src={`/images/MBTIcharacters/${user.mbti}.png`} alt={`${user.mbti}character`} />
              <div key={user.id}>{user.name}</div>
              <div key={user.id}>{user.mbti}</div>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex flex-row items-center h-full">
          <div className="flex-grow items-center"></div>
          <div className="basis-4/5 flex h-full flex-col items-center justify-center text-center" style={{ maxWidth: "80%", minWidth : "70%" }}>
            <div className="w-full mt-10 mb-10 flex flex-col items-center">
              <div className="flex justify-center items-center border">
                <img
                  src="/images/Ambers follow.png"
                  alt="0 팔로잉 이미지"
                  style={{
                    maxWidth: "40%",
                    height: "auto",
                    maxHeight: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
              <div
                className="mb-5 w-full text-center mt-5"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                팔로우한 유저가 없어요!
              </div>
            </div>
          </div>
          <div className="flex-grow"></div>
        </div>
      )}
      </div>
  );
};

export default FollowingUsers;