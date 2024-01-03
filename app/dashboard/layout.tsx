import SideLogo from "../component/layouts/SideLogo";
import SideNav from "../component/layouts/SideNav";
import Navbar from "../component/layouts/navbar";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col min-h-screen">
          <Navbar />
          {/* Page content here */}
          <div className="p-3">{children}</div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="p-4 w-64 min-h-full bg-white text-base-content">
            <SideLogo />
            <SideNav />
          </ul>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
