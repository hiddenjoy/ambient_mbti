// components/QuestionForAdminPage.js
import { useState } from "react";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

export default function QuestionForAdminPage({ question, onQuestionUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(question.content);

  async function handleUpdateQuestion() {
    const questionRef = doc(db, "questions", question.id);
  
    try {
      await updateDoc(questionRef, {
        content: updatedContent.trim(),
      });
      onQuestionUpdate(question.date, updatedContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating question: ", error);
    }
  }
  
  return (
    <div className="bg-yellow-100 rounded shadow-lg p-4 mb-4">
      <div className="text-gray-600 mb-2">{question.date}</div>
      {isEditing ? (
        <div>
          <textarea
            className="w-full h-40 px-4 py-2 mb-4 border border-gray-300 rounded"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          ></textarea>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={handleUpdateQuestion}
          >
            저장
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>{question.content}</div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => setIsEditing(true)}
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
}