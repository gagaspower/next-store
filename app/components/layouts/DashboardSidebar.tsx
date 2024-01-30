import { navigations } from "@/utils/navigation";
import Link from "next/link";
import React from "react";

function DashboardSidebar() {
  return (
    <>
      {navigations.map((item, index) => {
        return (
          <li key={index} className="group p-2 hover:bg-sky-500 rounded-sm">
            <Link href={item.url}>
              <span className="flex items-center gap-3 group-hover:text-white text-sm font-poppins">
                {item.icon} {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </>
  );
}

export default DashboardSidebar;
