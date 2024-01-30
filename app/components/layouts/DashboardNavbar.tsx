import { useSessionContext } from "@/context/sessionProvider";
import withAuth from "@/context/withAuth";
import { instance } from "@/utils/httpClient";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";

function DashboardNavbar() {
  const { setSessionAuth } = useSessionContext();
  const handleLogout = async () => {
    try {
      await instance.post(`/auth/logout`);
      localStorage.removeItem("auth");
      setSessionAuth({
        session_id: {
          name: "",
          roles: "",
        },
        token: "",
      });
    } catch (error) {
      throw error;
    }
  };

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
                  <button type="button" onClick={handleLogout}>
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

export default withAuth(DashboardNavbar, { roles: ["admin"] });
