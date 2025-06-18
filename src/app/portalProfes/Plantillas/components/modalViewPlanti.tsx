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
        className="py-2 text-gray-400 hover:text-gray-300 hover:shadow-[0_2px_2px_-1px_rgba(255,255,255,0.5)] transition-all duration-400"
        onClick={toggleModal}
      >
        <FaRegEye className="h-6 w-6" />
        <span className="sr-only">Ver Plantilla</span>
      </button>

      {modal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 overflow-y-auto print:overflow-visible print:static print:bg-white print:bg-opacity-100"
          role="dialog"
          aria-modal="true"
          aria-labelledby="planilla-title"
        >
          <div
            className="bg-gray-900 rounded-lg shadow-xl w-full md:w-3/4 max-w-5xl print:shadow-none print:w-full print:max-w-none"
            id="printable-content"
          >
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center gap-4 print:hidden">
              <div className="flex gap-2">
                <h2 className="text-xl font-bold text-gray-100">{plantilla.nombre}</h2>
              </div>
              <button
                className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                onClick={toggleModal}
                aria-label="Cerrar planilla"
              >
                <IoCloseCircleSharp className="h-9 w-9" />
              </button>
            </div>

            <div className="p-6 print-content">
              <div className="max-w-4xl mx-auto">
                {plantilla.trainingDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="mb-6 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                  >
                    <h3 className="text-xl font-bold text-center py-3 bg-gray-700 border-b border-gray-600 text-gray-100">
                      {day.day}
                    </h3>
                    <div className="p-4 space-y-4">
                      {Object.entries(day).map(
                        ([bloque, ejercicios]) =>
                          bloque.startsWith("Bloque") &&
                          ejercicios.length > 0 && (
                            <div
                              key={bloque}
                              className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700"
                            >
                              <h4 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                                <FaLayerGroup className="text-emerald-400" />
                                {bloque}
                              </h4>
                              <ul className="space-y-4">
                                {ejercicios.map(
                                  (exercise: Exercise, exerciseIndex: number) => (
                                    <li
                                      key={exerciseIndex}
                                      className="pb-4 border-b border-gray-700 last:border-0"
                                    >
                                      <div className="grid gap-2 text-gray-100">
                                        <p className="flex items-center gap-2 text-sm">
                                          <FaDumbbell className="text-emerald-400" />
                                          <span className="text-gray-400">
                                            Ejercicio:
                                          </span>
                                          <span className="font-bold text-base text-gray-100">
                                            {exercise.name}
                                          </span>
                                        </p>
                                        <p className="flex items-center gap-2 text-sm">
                                          <FaListOl className="text-emerald-400" />
                                          <span className="text-gray-400">
                                            Repeticiones:
                                          </span>
                                          <span className="font-bold text-base text-gray-100">
                                            {exercise.reps}
                                          </span>
                                        </p>
                                        <p className="flex items-center gap-2 text-sm">
                                          <FaLayerGroup className="text-emerald-400" />
                                          <span className="text-gray-400">
                                            Series:
                                          </span>
                                          <span className="font-bold text-base text-gray-100">
                                            {exercise.sets}
                                          </span>
                                        </p>
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
