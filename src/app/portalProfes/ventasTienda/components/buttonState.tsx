"use client";

import React, { useState } from "react";
import changeState from "../utils/changeState";

export const ButtonState = ({ventaId}:{ventaId:string}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedState, setSelectedState] = useState<'pagado' | 'rechazado' | null>(null);

  const handleStateChange = () => {
    if (!selectedState) {
      console.error("No se ha seleccionado un estado");
      return;
    }
    const res = changeState(ventaId, selectedState);
    if (!res) {
      console.error("Error al cambiar el estado de la venta");
      return;
    }
    console.log('Estado seleccionado:', selectedState);
    setShowModal(false);
  };

  return (
    <div>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        onClick={() => setShowModal(true)}
      >
        Cambiar Estado
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4">Cambiar Estado</h2>
            <div className="flex flex-col space-y-4 mb-6">
              <button
                className={`px-4 py-2 rounded ${
                  selectedState === 'pagado'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedState('pagado')}
              >
                Pagado
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  selectedState === 'rechazado'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedState('rechazado')}
              >
                Rechazado
              </button>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  setSelectedState(null);
                  setShowModal(false);
                }}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 text-white rounded ${
                  selectedState ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 cursor-not-allowed'
                }`}
                onClick={handleStateChange}
                disabled={!selectedState}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
