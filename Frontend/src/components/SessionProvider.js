"use client";  // ✅ Make this a Client Component

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}
