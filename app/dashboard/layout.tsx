"use client";
import withAuth from "@/context/withAuth";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardLogo = dynamic(
  () => import("@/components/layouts/DashboardLogo")
);
const DashboardNavbar = dynamic(
  () => import("@/components/layouts/DashboardNavbar")
);
const DashboardSidebar = dynamic(
  () => import("@/components/layouts/DashboardSidebar")
);
function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="drawer lg:drawer-open ">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col min-h-screen">
          <DashboardNavbar />
          {/* Page content here */}
          <div className="p-3">
            <div className="bg-white p-5 rounded-md relative">{children}</div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="p-4 w-64 min-h-full bg-white text-base-content">
            <DashboardLogo />
            <DashboardSidebar />
          </ul>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default withAuth(DashboardLayout, { roles: ["admin"] });
