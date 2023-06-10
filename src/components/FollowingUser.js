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
        // <div>팔로워가 없습니다 ㅠㅠ</div>

        <div className>
        <div className="flex flex-row items-center h-full">
          <div className="basis-1/3 flex h-full flex-col items-end"></div>
          <div className="basis-1/2 flex h-full flex-col items-center ">
            <div className=" w-full ">
              <div className="w-full mt-10 mb-10 items-center">
                <img
                  src="/images/Ambers follow.png"
                  alt="0 팔로잉 이미지"
                  style={{
                    maxWidth: "40%",
                    height: "auto",
                    maxHeight: "auto",
                    display: "block",
                    top: "50%",
                    transform: "translateY(10%)",
                    marginTop: "20% auto",
                    marginLeft: "10%",
                    marginTop: "25%",
                  }}
                />
                <div
                  className="basis-1/2 mb-5 w-full text-center mt-5  "
                  style={{
                    marginLeft: "-19%",
                    marginTop: "6%",
                    display: "block",
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "#",
                    whiteSpace: "nowrap",
                  }}
                >
                  팔로우한 유저가 없어요!
                </div>

                {/* <div
                  className="basis-1/2 mb-1 w-full text-center mt-1 textAlign:'center'"
                  style={{
                    marginLeft: "-17%",
                    display: "block",
                    fontWeight: "regular",
                    marginRight: "-17%",
                    fontSize: "14px",
                    color: "#6D6E71",
                    whiteSpace: "nowrap",
                  }}
                >
                  로그인하여 당신의 이야기를 들려주세요!
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      )}
      </div>
  );
};

export default FollowingUsers;