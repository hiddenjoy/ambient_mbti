import { useState, useEffect } from "react";
import mbtiColors from "@/data/mbtiColors.js";

const MbtiSelector = ({ defaultMbti, setDefaultMbti }) => {
  const [mbti, setMbti] = useState(defaultMbti || ["", "", "", ""]);

  const handleButtonChange = (value, index) => {
    if (mbti[index] !== value) {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        border: "1px solid black",
        width: "100%",
        padding: "0.25rem",
        margin: "0rem 0rem 1rem 0rem",
      }}
    >
      <div style={{ display: "grid", margin: "0.25rem", width: "25%" }}>
        {["E", "I"].map((value) => (
          <button
            key={value}
            style={{
              padding: "0.25rem",
              margin: "0.25rem",
              backgroundColor:
                mbti[0] === value ? `${mbtiColors[mbti]}` : "transparent",
              color: mbti[0] === value ? "black" : "initial",
              border:
                mbti[0] === value ? "none" : `1px solid ${mbtiColors[mbti]}`,
            }}
            onClick={() => handleButtonChange(value, 0)}
          >
            {value}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", margin: "0.25rem", width: "25%" }}>
        {["S", "N"].map((value) => (
          <button
            key={value}
            style={{
              padding: "0.25rem",
              margin: "0.25rem",
              backgroundColor:
                mbti[1] === value ? `${mbtiColors[mbti]}` : "transparent",
              color: mbti[1] === value ? "black" : "initial",
              border:
                mbti[1] === value ? "none" : `1px solid ${mbtiColors[mbti]}`,
            }}
            onClick={() => handleButtonChange(value, 1)}
          >
            {value}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", margin: "0.25rem", width: "25%" }}>
        {["F", "T"].map((value) => (
          <button
            key={value}
            style={{
              padding: "0.25rem",
              margin: "0.25rem",
              backgroundColor:
                mbti[2] === value ? `${mbtiColors[mbti]}` : "transparent",
              color: mbti[2] === value ? "black" : "initial",
              border:
                mbti[2] === value ? "none" : `1px solid ${mbtiColors[mbti]}`,
            }}
            onClick={() => handleButtonChange(value, 2)}
          >
            {value}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", margin: "0.25rem", width: "25%" }}>
        {["J", "P"].map((value) => (
          <button
            key={value}
            style={{
              padding: "0.25rem",
              margin: "0.25rem",
              backgroundColor:
                mbti[3] === value ? `${mbtiColors[mbti]}` : "transparent",
              color: mbti[3] === value ? "black" : "initial",
              border:
                mbti[3] === value ? "none" : `1px solid ${mbtiColors[mbti]}`,
            }}
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
