import connect from "@/lib/db";
import React from "react";
import Plantilla from "@/lib/models/plantilla";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IPlantilla } from "@/types/plantilla";

async function Plantillas() {
  await connect();
  const plantillas:IPlantilla[] = await Plantilla.find();
  console.log("Plantillas:", plantillas);
  return (
    <div>
      <section>
        <h1 className="text-6xl flex mx-auto text-slate-300 justify-center">
          Listado de Plantillas
        </h1>
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 my-10">
            Crear Nueva Plantilla
          </button>
        </div>
      </section>

      <main>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4 text-slate-300">Nombre</th>
                    <th className="py-3 px-4 text-slate-300">Descripción</th>
                    <th className="py-3 px-4 text-slate-300 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {plantillas && plantillas.map((plantilla) => (
                    <tr key={plantilla._id?.toString()} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-2 px-4 text-slate-300">{plantilla.nombre}</td>
                      <td className="py-2 px-4 text-gray-400">{plantilla.descripcion}</td>
                      <td className="py-2 px-4 flex justify-center gap-3">
                        <button
                          title="Editar plantilla"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          title="Eliminar plantilla"
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Plantillas;
