import React from "react";
import { IUser } from "@/types/user";
import AutoCompleteInput from "@/components/AutocompleteUsers";
import Pago from "@/lib/models/pagos";
import { IPago } from "@/types/pago";
import connect from "@/lib/db";
import Link from "next/link";
import User from "@/lib/models/user";

interface usersWithStringId extends Omit<IUser, "_id"> {
  _id: string;
}

async function Pagos() {
  await connect();
  let pagos: IPago[] = [];
  let users: IUser[] = [];
  let usersWithStringId: usersWithStringId[] = [];
  try {
    pagos = await Pago.find();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error al consultar los pagos realizados: " + err.message);
    } else {
      console.log("Error desconocido");
    }
  }

  


  return (
    <div>
      <div className="flex justify-end right-2 mb-10">

        <Link 
        href="/portalProfes/Pagos/NuevoPago"
        className="bg-blue-500 px-2 py-1 text-white ">+ Nuevo Pago</Link>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-50">
          <tr>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Usuario</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Fecha</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Monto</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Tipo</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Comprobante</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Estado</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Descripción</h2>
        </td>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pagos.map((pago) => (
        <tr key={pago.userID} className="hover:bg-gray-50">
          <td className="px-6 py-4 text-sm text-gray-500">
            {pago.userID}
            
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.fecha.toLocaleDateString()}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.monto}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.tipo}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p><Link href={pago.comprobante? pago.comprobante:"#"} target="_blank"> Comprobante </Link></p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.estado}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.descripcion}</p>
          </td>
        </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pagos;
