import React from "react";
import { getVentas } from "./utils/getVentas";
import { SalesStore } from "@/lib/models/ventasTienda";
import VentasTable from "./components/ventasTable";

export const dynamic = "force-dynamic"; // Para evitar el cacheo de la página
export default async function Page() {
  const ventas:SalesStore[] = await getVentas();


  const ventasWithStringId = ventas.map((venta:SalesStore) => ({
    _id: venta._id.toString(), // Convertir ObjectId a string
    cart: venta.cart.map(item => ({
      productItemName: item.productItemName,
      productItemDescription: item.productItemDescription,
      productItemPrice: item.productItemPrice,
      productItemSlug: item.productItemSlug,
      quantity: item.quantity // Asegurarse de que quantity esté presente
    })),
    date: new Date(venta.date).toISOString(), // Convertir Date a string
    state: venta.state, // Asegurarse de que el estado sea un string
    userName: venta.userName || '', // Asegurarse de que userName sea un string
    email: venta.email || '', // Asegurarse de que email sea un string
    telefono: venta.telefono || '', // Asegurarse de que telefono sea un string
    totalPrice: venta.totalPrice || 0, // Asegurarse de que totalPrice sea un number
    metodoPago: venta.metodoPago || '' // Asegurarse de que metodoPago sea un string
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-slate-200">Ventas de la Tienda</h1>
      {ventas.length > 0 ? (
        <VentasTable ventas={ventasWithStringId} />
      ) : (
        <p className="text-center">No hay ventas registradas.</p>
      )}
    </div>
  );
}
