"use client";
import { useSessionContext } from "@/context/sessionProvider";
import withAuth from "@/context/withAuth";
import React from "react";

function AccountPage() {
  const { sessionAuth } = useSessionContext();

  return (
    <div>
      <span>
        Hai, <strong>{sessionAuth?.session_id?.name}</strong>
      </span>
      <p>
        Selamat datang kembali di member area next store, selamat berbelanja
      </p>
    </div>
  );
}

export default withAuth(AccountPage, { roles: ["user"] });
