import { Jarak } from "@/components/application-ui/Spacing";
import withWebStore from "@/context/withWebStore";
import Link from "next/link";
import { BsMicrosoft } from "react-icons/bs";

function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full md:max-w-6xl m-auto  mt-5 mb-5 bg-white p-5 min-h-screen">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col p-5">
          {/* Page content here */}

          <div className="flex flex-row items-center justify-between">
            <label
              htmlFor="my-drawer-2"
              className="flex flex-row items-center gap-3 drawer-button lg:hidden"
            >
              <BsMicrosoft /> Menu
            </label>
          </div>
          <hr />
          <Jarak />
          {children}
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="flex flex-col p-5 w-56 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <Link
              href="#"
              className="text-sm group hover:bg-emerald-300 rounded-sm p-3"
            >
              <span className="group-hover:text-white">Update Password</span>
            </Link>
            <Link
              href="/account/address"
              className="text-sm group hover:bg-emerald-300 rounded-sm p-3"
            >
              <span className="group-hover:text-white">Alamat Saya</span>
            </Link>
            <Link
              href="#"
              className="text-sm group hover:bg-emerald-300 rounded-sm p-3"
            >
              <span className="group-hover:text-white">Riwayat Belanja</span>
            </Link>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default withWebStore(AccountLayout);
