"use client";
import withAuth from "@/context/withAuth";
import React from "react";

function AccountPage() {
  return <div>AccountPage</div>;
}

export default withAuth(AccountPage, { roles: ["user"] });
