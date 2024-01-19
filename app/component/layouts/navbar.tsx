import withAuth from "@/app/hook/withAuth";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";

function Navbar() {
  // const handleLogout = async () => {
  //   try {
  //     await instance.post(`/auth/logout`);
  //     localStorage.removeItem("auth");

  //   } catch (error) {
  //     throw error;
  //   }
  // };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <label htmlFor="my-drawer-2" className="btn lg:hidden">
          <AiOutlineMenu />
        </label>
      </div>
      <div className="flex-none z-20">
        <ul className="menu menu-horizontal px-1 w-full">
          <li>
            <details>
              <summary>ff</summary>
              <ul className="p-2 bg-base-100 rounded-t-none -translate-x-40 w-56">
                <li>
                  <a>Update Password</a>
                </li>
                <li>
                  <button type="button" onClick={() => console.log("tes")}>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withAuth(Navbar);
