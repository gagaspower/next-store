"use client";
import React from "react";
import withAuth from "@/context/withAuth";
function Dashboard() {
  return (
    <div>
      <span>Hello world</span>
    </div>
  );
}

export default withAuth(Dashboard, { roles: ["admin"] });
