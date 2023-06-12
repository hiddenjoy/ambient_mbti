import Layout from "@/components/Layout";
import UserProfile from "@/components/UserProfile";
import { format } from "date-fns";
import AmbientAnswerList from "@/components/AmbientAnswerList";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase/index.js";
import { useRouter } from "next/router";
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
import SmallAnswerList from "@/components/SmallAnswerList";

const userCollection = collection(db, "users");
const answerCollection = collection(db, "answers");

const AnotherUserId = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSession();
  const [anotherUser, setAnotherUser] = useState();
  const [anotherUserId, setanotherUserId] = useState();

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady, id]);

  const getAnotherUser = async () => {
    const userRef = doc(userCollection, id);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    setAnotherUser(userData);
    setanotherUserId(id);
  };

  useEffect(() => {
    getAnotherUser();
    getAnswer();
  }, [id]);

  const getAnswer = async () => {
    const q = query(answerCollection, where("user.id", "==", id));
    const results = await getDocs(q);

    const newAnswers = [];
    results.docs.forEach((doc) => {
      newAnswers.push({ id: doc.id, ...doc.data() });
    });

    setAnswers(newAnswers);
  };

  return (
    <>
      <Layout>
        <div className="flex flex-row h-full">
          <div className="w-full h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
            <h1 className="text-3xl font-bold text-primary p-3">
              {anotherUser ? anotherUser.name : <p>...</p>}'s page
            </h1>
            <UserProfile profiledUserId={id} />
          </div>
          <div className="basis-4/5 grid grid-cols-4 gap-4">
            {answers.map((item) => (
              <AmbientAnswerList key={item.id} answer={item} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AnotherUserId;
