import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/index.js";

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      setUsers(userList);
    }

    fetchUsers();
  }, []);

  return (
    <div className="flex justify-center h-screen">
      <div className="grid m-auto text-center">
        <div className="m-4">User List</div>
        {users &&
          users.map((user, index) => (
            <div key={index}>
              <p>Name: {user.name}</p>
              <p>MBTI: {user.mbti}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
