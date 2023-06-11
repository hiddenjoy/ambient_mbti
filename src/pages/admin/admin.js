import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import UserProfileForAdminPage from "@/components/UserProfileForAdminPage";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, orderBy("name"));
      const userSnapshot = await getDocs(q);
      const userList = userSnapshot.docs.map((doc) => doc.data()).sort((a, b) => {
        if(!a.name) return 1;
        if(!b.name) return -1;
        return a.name.localeCompare(b.name);
      });
      setUsers(userList);
    }

    fetchUsers();
  }, []);

  function getChosung(char) {
    const chosung = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const base = '가'.charCodeAt(0);
    return chosung[Math.floor((char.charCodeAt(0) - base) / 588)];
  }
  
  const filteredUsers = users.filter((user) => {
    if (filter === "기타") {
      return user.name && !/^[ㄱ-ㅎ]/.test(getChosung(user.name[0]));
    }
    return user.name && getChosung(user.name[0]) === filter;
  });

  return (
    <div className="flex justify-center h-screen p-4 m-8">
      <div className="w-3/4 bg-white rounded-lg shadow p-4 ml-4">
        <div className="flex justify-between mb-4">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            Previous page
          </button>
          <h1 className="text-2xl">User List</h1>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setPage(Math.min(page + 1, Math.ceil(filteredUsers.length / 5)))}
            disabled={page * 5 >= filteredUsers.length}
          >
            Next page
          </button>
        </div>
        {filteredUsers.slice((page - 1) * 5, page * 5).map((user, index) => (
          <UserProfileForAdminPage key={index} user={user} />
        ))}
      </div>
      <div className="w-1/12 bg-white rounded-lg shadow p-4 ml-4">
        {['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','기타'].map((letter, index) => (
          <button 
            key={index}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => { setPage(1); setFilter(letter); }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
