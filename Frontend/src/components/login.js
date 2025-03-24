// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await signIn("credentials", {
//       redirect: false,
//       email,
//       password
//     });

//     if (result.error) {
//       alert("Invalid Credentials");
//     } else {
//       window.location.href = "/"; // Redirect after successful login
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
//       <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           className="p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button onClick={() => signIn("authentik", { callbackUrl: "http://localhost:3000" })} type="submit" className="p-2 bg-blue-500 text-white rounded">
//           Sign In
//         </button>
//         <p className="mt-4">You have no account? <a href="/signup" className="text-blue-500">Sign Up</a></p>
//       </form>
//     </div>
//   );
// }

"use client";  // Ensure this runs on the client side

import { signIn, useSession } from "next-auth/react";

const AUTHENTIK_SIGNUP_URL = "http://localhost:9000/if/flow/registration/";
const AUTHENTIK_LOGIN_URL = "http://localhost:9000/application/o/portfolio/";

export default function LoginPage() {
  const { data: session } = useSession();

  if(!session){
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
      <h1>Welcome</h1>
      <p>Sign in or sign up using Authentik SSO</p>

      <button 
        onClick={() => signIn("authentik", { callbackUrl: process.env.NEXTAUTH_URL})} 
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Sign in with Authentik
      </button>

      <button 
        onClick={() => window.location.href = AUTHENTIK_SIGNUP_URL} 
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign up with Authentik
      </button>
    </div>
  );}else{
    <>{session}</>
  }
}

