"use client";
import Navbar from '../../components/Navbar';
import Login from '../../components/login';
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    if(!session){
        return (
            <>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                    <Login/>
            </div>
            <footer className="footer">
                All copy rights are reserved to Omar Attia. @2024.
            </footer>
            </>
              ) 
    }else{
        return (
            <>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                    <Login/>
            </div>
            <footer className="footer">
                All copy rights are reserved to Omar Attia. @2024.
            </footer>
            </>
            // <button onClick={() => signIn("authentik")}>Login with Authentik</button>
        )
    }


}