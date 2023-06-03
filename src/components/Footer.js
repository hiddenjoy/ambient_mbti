import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col items-end m-5">
      <div> © 2023. 회색커피</div>
      <div className="text-xs text-gray-500">
        권혁범, 박은빈, 유성현, 이지예, 장다예
      </div>
    </div>
  );
};

export default Footer;
