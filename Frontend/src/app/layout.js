// "use client";

// import AuthProvider from "../components/SessionProvider";

// import Home from "../components/Home"
// import '../styles/globals.css'; // Ensure you are using global styles if needed
// import '../styles/layout.css';


// export default function RootLayout({ children }) {

//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider> 
//           <div>
//             <Home/>
//         </div>
//       </AuthProvider>
//       </body>
//     </html>
//   );
// }
"use client"; 
import '../styles/globals.css'; 
import '../styles/layout.css';
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

