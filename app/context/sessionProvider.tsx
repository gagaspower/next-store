"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface ISessionData {
  session_id: {
    id: number;
    name: string;
    roles: string;
  };
  token: string;
}

export type IAuthContext = {
  sessionAuth: ISessionData;
  setSessionAuth: React.Dispatch<React.SetStateAction<ISessionData>>;
};

export const SessionContext = createContext<IAuthContext | undefined>(
  undefined
);

export const useSessionContext = (): IAuthContext => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within an SessionProvider");
  }
  return context;
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionAuth, setSessionAuth] = useState<ISessionData>({
    session_id: {
      id: 0,
      name: "",
      roles: "",
    },
    token: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedSession = window.localStorage.getItem("auth");
      if (storedSession) {
        setSessionAuth(JSON.parse(storedSession));
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={{ sessionAuth, setSessionAuth }}>
      {children}
    </SessionContext.Provider>
  );
}
