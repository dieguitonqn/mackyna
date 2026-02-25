"use client";
import { CartItemSold, SalesStore } from "@/lib/models/ventasTienda";
import React, { useState, useEffect } from "react";
import { ButtonState } from "./buttonState";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const VentasTable = ({ ventas }: { ventas: SalesStore[] }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredVentas = ventas.filter((venta) => {
    const searchLower = search.toLowerCase();
    return (
      (venta.userName?.toLowerCase() || "").includes(searchLower) ||
      (venta.email?.toLowerCase() || "").includes(searchLower) ||
      (venta.telefono?.toString() || "").includes(searchLower)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);

  return (
    <>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-emerald-400 w-80 bg-gray-800 text-gray-100 placeholder-gray-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border bg-gray-800 border-gray-500 text-sm rounded-md">
          <thead>
            <tr className="text-gray-200">
              <th className="border border-gray-500 px-2 py-2 text-center">Cliente</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Email</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Teléfono</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Productos</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Total</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Método de Pago</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Fecha</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Estado</th>
              <th className="border border-gray-500 px-2 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVentas.map((venta) => (
              <tr
                key={venta._id as string}
                className="hover:bg-gray-400 hover:text-black text-gray-300 border-b border-gray-500 last:border-b-0"
              >
                <td className="px-2 py-2 text-center">{venta.userName || ""}</td>
                <td className="px-2 py-2 text-center">{venta.email || ""}</td>
                <td className="px-2 py-2 text-center">{venta.telefono || ""}</td>
                <td className="px-2 py-2 text-center">
                  {Array.isArray(venta.cart) && venta.cart.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {venta.cart.map((prod: CartItemSold, idx: number) => (
                        <li key={idx}>
                          {prod.productItemName} x {prod.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="px-2 py-2 text-center">${venta.totalPrice}</td>
                <td className="px-2 py-2 text-center">{venta.metodoPago}</td>
                <td className="px-2 py-2 text-center">
                  {new Date(venta.date).toLocaleDateString()}
                </td>
                <td className="px-2 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-2 rounded-full text-xs font-medium ${
                      venta.state === "pagado"
                        ? "bg-green-600 text-white"
                        : venta.state === "rechazado"
                        ? "bg-red-600 text-white"
                        : venta.state === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {venta.state === "pagado" && "Pagado ✓ "}
                    {venta.state === "rechazado" && "✗ Rechazado"}
                    {venta.state === "pending" && "⌛ Pendiente"}
                  </span>
                </td>
                <td className="px-2 py-2 text-center">
                  <ButtonState ventaId={venta._id.toString()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaArrowLeft />
          </button>
          <span className="text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </>
  );
};
export default VentasTable;
