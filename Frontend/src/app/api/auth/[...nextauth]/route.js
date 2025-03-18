// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import AuthentikProvider from "next-auth/providers/authentik";
import { NextResponse } from "next/server";  // Optional: can help wrap responses if needed

const authOptions = {
  providers: [
    AuthentikProvider({
      clientId: process.env.AUTHENTIK_ID || "AUTHENTIK_CLIENT_ID",
      client_id: process.env.AUTHENTIK_CLIENT_ID,
      clientSecret: process.env.AUTHENTIK_SECRET || "AUTHENTIK_CLIENT_SECRET",
      issuer: process.env.AUTHENTIK_ISSUER,  // Issuer URL from Authentik
    })
    // ... add other providers here if needed
  ],
  secret: process.env.NEXTAUTH_SECRET || "",
  session: { strategy: "jwt" },
  callbacks: {
    // (Optional) Add custom NextAuth callbacks if needed
    async session({ session, token, user }) {
      // Example: you could attach additional user info to session here
      return session;
    },
    // async signIn({ account, profile }) { ... } // e.g., to control sign-in
    // async jwt({ token, user }) { ... }         // for custom JWT claims
  },
  // secret: process.env.NEXTAUTH_SECRET, // In production, ensure this is set in env
  // other NextAuth options (e.g., pages or session strategy) can go here
};

console.log("AUTHENTIK_CLIENT_ID:", process.env.AUTHENTIK_CLIENT_ID);
console.log("AUTHENTIK_CLIENT_SECRET:", process.env.AUTHENTIK_CLIENT_SECRET ? "Loaded" : "Missing");
console.log("AUTHENTIK_ISSUER:", process.env.AUTHENTIK_ISSUER);

const handler = NextAuth(authOptions);

// Export the NextAuth handler for GET and POST requests.
export const GET = handler;
export const POST = handler;
