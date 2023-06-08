import { db } from "@/firebase";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";

async function handler(req, res) {
  const collectionRef = collection(db, "users");

  const querySnapshot = await getDocs(collectionRef);
  const numUsers = querySnapshot.size;

  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  const { email, password } = data;
  const q = query(collectionRef, where("email", "==", email));
  const queryDocs = await getDocs(q);

  if (!email) {
    res.status(422).json({
      message: "이메일을 입력해 주세요",
      error: true,
    });
    return;
  } else if (!email.includes("@")) {
    res.status(422).json({
      message: "이메일 형식을 확인해 주세요",
      error: true,
    });
  } else if (!password) {
    res.status(422).json({
      message: "비밀번호를 입력해 주세요",
      error: true,
    });
    return;
  } else if (password.trim().length < 8) {
    res.status(422).json({
      message: "비밀번호를 8자리 이상으로 설정해 주세요",
      error: true,
    });
    return;
  } else if (!queryDocs.empty) {
    res.status(422).json({
      message: "이미 가입된 유저입니다",
      error: true,
    });
    return;
  }

  const newUserRef = {
    id: numUsers + 1,
    email: email,
    password: password,
  };

  try {
    const newDocRef = doc(collectionRef, `${numUsers + 1}`);
    await setDoc(newDocRef, newUserRef);
    console.log("Document successfully written!");
    } catch (error) {
        console.log("Error writing document: ", error);
    }

  const userId = newUserRef.id;
  const result = { id: userId, email: email };

  if (result) {
    res.status(201).json({ message: "Created user!", error: false });
  } else {
    res.status(422).json({ message: "error occurred", error: true });
  }
}

export default handler;