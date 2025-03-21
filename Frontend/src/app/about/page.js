"use client";
import Navbar from '../../components/Navbar';

export default function About() {

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <div style={{"width": 1700, "height": 800}} className="max-w-4xl w-full flex items-center justify-center flex-grow" id="data_view_container">
                    About
                </div>
            </div>
            <footer className="footer">
                All copy rights are reserved to Omar Attia. @2024.
            </footer>
        </>
    ) 
}