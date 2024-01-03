import React from "react";
import { BsCart4 } from "react-icons/bs";

function SideLogo() {
  return (
    <div className="flex flex-row justify-center p-2 mb-8 gap-1">
      <BsCart4 size={25} />
      <div>
        <span className="font-poppins text-lg font-bold text-sky-500">
          Next
        </span>
        <span className="font-poppins text-lg ">Toko</span>
      </div>
    </div>
  );
}

export default SideLogo;
