import connect from "@/lib/db";
import React from "react";
import Plantilla from "@/lib/models/plantilla";
import { IPlantillaSId } from "@/types/plantilla";
import { ModalViewPlanti } from "./components/modalViewPlanti";
import { DeleteButton } from "./components/deleteButton";
import { EditButton } from "./components/editButton";

export const dynamic = "force-dynamic";

async function Plantillas() {
  await connect();
  const plantillas = await Plantilla.find().lean();
  const plantillasWithStringIds: IPlantillaSId[] = plantillas.map((plantilla) => ({
    ...plantilla,
    _id: plantilla._id?.toString(),
    nombreUser: plantilla.nombreUser || "Usuario Desconocido",
    createdAt: plantilla.createdAt?.toISOString(),
    updatedAt: plantilla.updatedAt?.toISOString(),
    trainingDays: plantilla.trainingDays || [],
    nombre: plantilla.nombre || "Sin Nombre",
    descripcion: plantilla.descripcion || "Sin Descripción",
  }));

  return (
    <div className="mx-auto w-full max-w-7xl py-2">
      <header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9dc75]">Rutinas reutilizables</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Plantillas</h1>
          <p className="mt-2 text-sm text-slate-400">Consultá y administrá estructuras de entrenamiento guardadas.</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
          {plantillasWithStringIds.length} {plantillasWithStringIds.length === 1 ? "plantilla" : "plantillas"}
        </span>
      </header>

      <main className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111713] shadow-[0_18px_50px_-35px_rgba(0,0,0,0.9)]">
        <div className="overflow-x-auto">
          <table className="portal-profes-table min-w-[650px] w-full text-left">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Usuario</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plantillasWithStringIds.length ? plantillasWithStringIds.map((plantilla) => (
                <tr key={plantilla._id}>
                  <td className="font-medium text-white">{plantilla.nombre}</td>
                  <td className="max-w-md text-slate-400">{plantilla.descripcion}</td>
                  <td className="text-slate-400">{plantilla.nombreUser || "Usuario Desconocido"}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <EditButton id={plantilla._id!} />
                      <DeleteButton id={plantilla._id!} />
                      <ModalViewPlanti plantilla={plantilla} />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">
                    Todavía no hay plantillas guardadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Plantillas;
