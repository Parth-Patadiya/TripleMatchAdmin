// src/hoc/withAuth.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// This HOC will protect a page from being accessed by unauthenticated users
export const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthProtectedPage = (props: any) => {
    const router = useRouter();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // If no token is found, redirect to the sign-in page
        router.push("/auth/signin");
      }
    }, []);

    if (token) {
      return <WrappedComponent {...props} />;
    }
  };

  return AuthProtectedPage;
};
