import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";

export const metadata = {
  title: "CatMiner",
  description: "CatMiner - Secure and exact catalytic converter pricing system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
