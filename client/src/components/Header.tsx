import React from "react";
import { MdOutlineDiamond } from "react-icons/md";
import profilePic from "../assets/profile.jpg";
const Header = () => {
  return (
    <div className="flex justify-between p-8 items-center">
      <div className="flex justify-start items-center gap-4">
        <img src={profilePic} className="rounded-full size-20 bg-amber-100 " />
        <div className="text-2xl">
          <h2 className="font-bold">Joshua Joseph</h2>
          <p>id-123455</p>
        </div>
      </div>
      <div className="flex justify-center items-center bg-[#4fa4fe] rounded-2xl gap-3 py-4 px-10 text-5xl">
        <MdOutlineDiamond /> <span className="text-4xl">20</span>
      </div>
    </div>
  );
};

export default Header;
