"use client";

import Navbar from './Navbar';
import Dataview from "./Dataview";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    // if(session){
        return (
            <>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <div style={{"width": 1700, "height": 800, "paddingleft": 100}} className="max-w-4xl w-full flex items-center justify-center flex-grow" id="data_view_container">
                    <Dataview/>
                </div>
            </div>
            <footer className="footer">
                All copy rights are reserved to Omar Attia. @2024.
            </footer>
            </>
              ) ;
    // }else{
    //     return (
    //         <button onClick={() => signIn("authentik")}>Login with Authentik</button>
    //     )
    // }


}