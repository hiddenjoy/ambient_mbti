import { useState } from "react";

const MbtiButton = () => {
  //임시로 만듦 mbti
  const [selectedMbti, setSelectedMbti] = useState('');

  const handleButtonClick = (value) => {
    setSelectedMbti(value);
  };

  const Button = ({ value }) => {
    return (
      <button onClick={() => handleButtonClick(value)} className="bg-lime-100 rounded p-3">
        {value}
      </button>
    );
  };

  return (
    <div className="grid grid-rows-2 grid-flow-col gap-4">
      <Button value="E" />
      <Button value="I" />
      <Button value="N" />
      <Button value="S" />
      <Button value="T" />
      <Button value="F" />
      <Button value="J" />
      <Button value="P" />
    </div>
  );
};

export default MbtiButton;