import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between p-2 items-center">
      <div className="flex justify-start items-center gap-2">
        <img src="" className="rounded-full size-16 bg-amber-100 " />
        <div className="text-xl">
          <h4>Joshua Joseph</h4>
          <p>id-123455</p>
        </div>
      </div>
      <div className="bg-blue-600 w-1/5 rounded-lg text-center p-4">20</div>
    </div>
  );
};

export default Header;
