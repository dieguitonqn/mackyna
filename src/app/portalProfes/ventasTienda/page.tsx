import { ButtonState } from "./components/buttonState";
import { getVentas } from "./utils/getVentas";
import { CartItemSold } from "@/lib/models/ventasTienda";

export const dynamic = "force-dynamic"; // Para evitar el cacheo de la página
export default async function Page() {
  const ventas = await getVentas();
  console.log("Ventas obtenidas:", ventas);
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-slate-200">Ventas de la Tienda</h1>
      {ventas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border bg-gray-800 border-gray-500 text-sm rounded-md">
            <thead>
              <tr className="text-gray-200">
                <th className="border border-gray-500 px-2 py-2 text-center">Cliente</th>
                <th className="border border-gray-500 px-2 py-2 text-center">Email</th>
                <th className="border border-gray-500 px-2 py-2 text-center">Teléfono</th>
                <th className="border border-gray-500 px-2 py-2 text-center">Productos</th>
                <th className="border border-gray-500 px-2 py-2 text-center">Total</th>
                <th className="border border-gray-500 px-2 py-2 text-center">Fecha</th>
                <th className="border border-gray-500 px-2 py-2 text-center">Estado</th>
                <th className="border border-gray-500 px-2 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta._id} className="hover:bg-gray-400 hover:text-black text-gray-300 border-b border-gray-500 last:border-b-0">
                  <td className="px-2 py-2 text-center">{venta.userName}</td>
                  <td className="px-2 py-2 text-center">{venta.email}</td>
                  <td className="px-2 py-2 text-center">{venta.telefono}</td>
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
                  <td className="px-2 py-2 text-center">{new Date(venta.date).toLocaleDateString()}</td>
                    <td
                        className={`px-2 py-2 text-center ${
                            venta.state === "pagado"
                                ? "text-black font-semibold bg-green-600 rounded"
                                : venta.state === "rechazado"
                                ? "text-slate-200 font-semibold bg-red-600 rounded "
                                : venta.state=== "pending"
                                ? "text-slate-200 font-semibold bg-yellow-600 rounded"
                                : "text-slate-200 font-semibold bg-gray-500 rounded"
                        }`}
                    >
                        {venta.state}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <ButtonState ventaId={venta._id.toString()} />
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No hay ventas registradas.</p>
      )}
    </div>
  );
}
