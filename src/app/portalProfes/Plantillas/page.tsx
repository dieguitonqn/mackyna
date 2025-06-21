
import connect from "@/lib/db";
import React from "react";
import Plantilla from "@/lib/models/plantilla";
import { IPlantillaSId } from "@/types/plantilla";


import { ModalViewPlanti } from "./components/modalViewPlanti";
import { DeleteButton } from "./components/deleteButton";
import { EditButton } from "./components/editButton";

async function Plantillas() {
  await connect();
  const plantillas= await Plantilla.find().lean();
  const plantillasWithStringIds:IPlantillaSId[] = plantillas.map((plantilla) => ({
    ...plantilla,
    _id: plantilla._id?.toString(), // Convertir ObjectId a string
    nombreUser: plantilla.nombreUser || "Usuario Desconocido", // Asegurar que siempre haya un nombre de usuario
    createdAt: plantilla.createdAt?.toISOString(), // Convertir fecha a string ISO
    updatedAt: plantilla.updatedAt?.toISOString(), // Convertir fecha a string ISO
    trainingDays: plantilla.trainingDays || [], // Asegurar que siempre haya un array de días de entrenamiento
    nombre: plantilla.nombre || "Sin Nombre", // Asegurar que siempre haya un nombre
    descripcion: plantilla.descripcion || "Sin Descripción", // Asegurar que siempre haya una descripción
  }));
  // console.log("Plantillas:", plantillasWithStringIds);

  
  return (
    <div>
      <section>
        <h1 className="text-6xl flex mx-auto text-slate-300 justify-center my-10">
          Listado de Plantillas
        </h1>
        {/* <div className="flex justify-center mt-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 my-10">
            Crear Nueva Plantilla
          </button>
        </div> */}
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
                    <th className="py-3 px-4 text-slate-300">Usuario</th>
                    <th className="py-3 px-4 text-slate-300 text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plantillasWithStringIds &&
                    plantillasWithStringIds.map((plantilla) => (
                      <tr
                        key={plantilla._id}
                        className="border-b border-gray-700 hover:bg-gray-700"
                      >
                        <td className="py-2 px-4 text-slate-300">
                          {plantilla.nombre}
                        </td>
                        <td className="py-2 px-4 text-gray-400">
                          {plantilla.descripcion}
                        </td>
                        <td className="py-2 px-4 text-gray-400">
                          {plantilla.nombreUser
                            ? plantilla.nombreUser
                            : "Usuario Desconocido"}
                        </td>
                        <td className="py-2 px-4 flex justify-center items-center gap-3">
                          <EditButton id={plantilla._id!} />
                          <DeleteButton id={plantilla._id!}/>
                          <ModalViewPlanti plantilla={plantilla} />
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
