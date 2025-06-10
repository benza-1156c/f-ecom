"use client";

import { api } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null) as any;

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null) as any;
  const [loading, setLoading] = useState(false) as any;

  const getUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/@me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else if (res.status === 401) {
        const res = await fetch(`${api}/refresh-token`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUser(data?.user);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext) as any;
