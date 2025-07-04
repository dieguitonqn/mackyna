import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import Providers from "./Providers";
import Footer from "@/components/Footer";
import { CartProvider } from "@/app/Tienda/context/CartContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mackyna",
  description: "Centro de entrenamiento personalizado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-black via-green-700 to-black min-h-screen overflow-x-scroll`}
      >
        {/* <CartProvider> */}
          <Providers>
            <Navbar />
            {children}
          </Providers>
        {/* </CartProvider> */}
        <Footer />
      </body>
    </html>
  );
}
