import { useState } from "react";

const MbtiSelector = ({ defaultMbti, onMbtiChange }) => {
  const [mbti, setMbti] = useState(defaultMbti || ["", "", "", ""]);

  const handleButtonChange = (value, index) => {
    if (mbti[index] === value) {
      const newMbti = [...mbti];
      newMbti[index] = "";
      setMbti(newMbti);
      onMbtiChange(newMbti);
    } else {
      const newMbti = [...mbti];
      newMbti[index] = value;
      setMbti(newMbti);
      onMbtiChange(newMbti);
    }
  };

  return (
    <div className="flex px-2">
      <div className="grid grid-cols-1 gap-2 mb-4 mx-1">
        {["E", "I"].map((value) => (
          <button
            className={`p-1 ${
              mbti[0] === value
                ? "bg-blue-500 text-white"
                : "border border-blue-500"
            }`}
            onClick={() => handleButtonChange(value, 0)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 mb-4 mx-1">
        {["S", "N"].map((value) => (
          <button
            className={`p-1 ${
              mbti[1] === value
                ? "bg-blue-500 text-white"
                : "border border-blue-500"
            }`}
            onClick={() => handleButtonChange(value, 1)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 mb-4 mx-1">
        {["F", "T"].map((value) => (
          <button
            className={`p-1 ${
              mbti[2] === value
                ? "bg-blue-500 text-white"
                : "border border-blue-500"
            }`}
            onClick={() => handleButtonChange(value, 2)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 mb-4 mx-1">
        {["J", "P"].map((value) => (
          <button
            className={`p-1 ${
              mbti[3] === value
                ? "bg-blue-500 text-white"
                : "border border-blue-500"
            }`}
            onClick={() => handleButtonChange(value, 3)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MbtiSelector;
