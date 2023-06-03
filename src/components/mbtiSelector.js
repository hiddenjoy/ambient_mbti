import { set } from "date-fns";
import { useState, useEffect } from "react";

const MbtiSelector = ({ defaultMbti, setDefaultMbti }) => {
  const [mbti, setMbti] = useState(defaultMbti || ["", "", "", ""]);

  const handleButtonChange = (value, index) => {
    if (mbti[index] != value) {
      const newMbti = [...mbti];
      newMbti[index] = value;
      setMbti(newMbti);
      setDefaultMbti(newMbti);
    }
  };

  useEffect(() => {
    if (typeof defaultMbti === "string") {
      setDefaultMbti(defaultMbti);
      setMbti(defaultMbti);
    } else {
      setDefaultMbti(defaultMbti.join(""));
      setMbti(defaultMbti.join(""));
    }
  }, [defaultMbti]);

  return (
    <div className="flex justify-center border w-full p-3">
      <div className="grid mx-1 w-1/4">
        {["E", "I"].map((value) => (
          <button
            key={value}
            className={`p-1 m-1 ${
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

      <div className="grid mx-1 w-1/4">
        {["S", "N"].map((value) => (
          <button
            key={value}
            className={`p-1 m-1 ${
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
      <div className="grid mx-1 w-1/4">
        {["F", "T"].map((value) => (
          <button
            key={value}
            className={`p-1 m-1 ${
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
      <div className="grid mx-1 w-1/4">
        {["J", "P"].map((value) => (
          <button
            key={value}
            className={`p-1 m-1 ${
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
