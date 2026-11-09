"use client";
import { IPlantillaSId } from "@/types/plantilla";
import React, { useState } from "react";
import { FaDumbbell, FaListOl, FaLayerGroup, FaRegEye } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { Exercise } from "@/types/plani";


export const ModalViewPlanti = ({ plantilla }: { plantilla: IPlantillaSId }) => {
  const [modal, setModal] = useState(false);
  
  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div>
      <button
        title="Ver Plantilla"
        className="rounded-lg p-2 text-slate-400 transition hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
        onClick={toggleModal}
      >
        <FaRegEye className="h-6 w-6" />
        <span className="sr-only">Ver Plantilla</span>
      </button>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm print:overflow-visible print:static print:bg-white print:bg-opacity-100 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="planilla-title"
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#101612] shadow-2xl print:w-full print:max-w-none print:rounded-none print:border-0 print:shadow-none"
            id="printable-content"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#111713]/95 p-4 backdrop-blur print:hidden">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b9dc75]">Vista previa</p>
                <h2 id="planilla-title" className="mt-1 truncate text-lg font-semibold text-white">{plantilla.nombre}</h2>
              </div>
              <button
                className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                onClick={toggleModal}
                aria-label="Cerrar planilla"
              >
                <IoCloseCircleSharp className="h-7 w-7" />
              </button>
            </div>

            <div className="p-4 print-content sm:p-7 lg:p-9">
              <div className="max-w-4xl mx-auto">
                {plantilla.trainingDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="training-day mb-5 overflow-hidden rounded-2xl border border-white/10 bg-[#121a15]"
                  >
                    <h3 className="border-b border-white/10 bg-[#18231b] px-4 py-4 text-base font-semibold text-white sm:px-5">
                      {day.day}
                    </h3>
                    <div className="space-y-4 p-3 sm:p-5">
                      {Object.entries(day).map(
                        ([bloque, ejercicios]) =>
                          bloque.startsWith("Bloque") &&
                          ejercicios.length > 0 && (
                            <div
                              key={bloque}
                              className="rounded-2xl border border-white/[0.08] bg-[#0e1410] p-4 sm:p-5"
                            >
                              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#d7f0b2]">
                                <FaLayerGroup className="text-[#b9dc75]" />
                                {bloque}
                              </h4>
                              <ul className="space-y-3">
                                {ejercicios.map(
                                  (exercise: Exercise, exerciseIndex: number) => (
                                    <li
                                      key={exerciseIndex}
                                      className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
                                    >
                                      <div className="grid gap-3 text-slate-200">
                                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                                          <FaDumbbell className="text-[#b9dc75]" />
                                          {exercise.name}
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                                          <p className="rounded-xl bg-black/15 px-3 py-2.5 text-xs text-slate-500"><FaListOl className="mr-1 inline text-[#b9dc75]" /> Repeticiones <span className="mt-1 block text-sm font-semibold text-slate-100">{exercise.reps}</span></p>
                                          <p className="rounded-xl bg-black/15 px-3 py-2.5 text-xs text-slate-500"><FaLayerGroup className="mr-1 inline text-[#b9dc75]" /> Series <span className="mt-1 block text-sm font-semibold text-slate-100">{exercise.sets}</span></p>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
