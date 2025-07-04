import Link from "next/link";
import Image from "next/image";
import CartSidebar from "./componentes/CartSidebar";
import dynamic from "next/dynamic";
import { CartProvider } from "./context/CartContext";


export default function TiendaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // const CartSidebar = dynamic(() => import("@/app/Tienda/componentes/CartSidebar"), { ssr: false });
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-scroll">
      <CartProvider>
       <CartSidebar />
     

      {/* Main Content */}
      <main className="flex-grow p-2 md:p-8 antialiased bg-gradient-to-r from-black via-green-900 to-black">
        {/* <h1 className="text-2xl font-bold text-gray-800">Portal de Profesores</h1> */}

        {children}
      </main>
      </ CartProvider>
    </div>
  );
}
