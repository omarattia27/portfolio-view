"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Protected() {
  const [message, setMessage] = useState("Loading...");
  const [clicks, setClicks] = useState(0);
  const { data: session } = useSession(); // Get session data

  useEffect(() => {
    console.log("===> 13 ",clicks);
    //if (!session) return; // If no session, do nothing
    console.log("===> 12");
    const fetchProtectedData = async () => {
      console.log("===> 14 ", session);
      try {
        const response = await fetch("http://localhost:8000/protected-data", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.accessToken}`, // Pass token
            // "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        console.log("===> ",data)
        setMessage(data.message); // Show response from API
      } catch (error) {
        console.error("Error fetching protected data:", error);
        setMessage("Failed to fetch protected data.");
      }
    };

    fetchProtectedData();
  }, [clicks]);

  const handleClick = () => {
      setClicks(clicks+1)
    };

  return (
    <div>
      <h1>Protected API Response:</h1>
      <p>{message}</p>
      <button onClick={() => setClicks(clicks+1)}>click me</button>
    </div>
  );
}
