import localFont from "next/font/local";
import Navbar from './components/Navbar';
import Dataview from "./components/Dataview";
import './globals.css'; // Ensure you are using global styles if needed
import './layout.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div style={{"width": 1700, "height": 800}} className="max-w-4xl w-full flex items-center justify-center flex-grow" id="data_view_container">
            <Dataview/>
          </div>
        </div>
      </body>
    </html>
  );
}
