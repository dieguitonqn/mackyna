import React, { useState } from "react";



export const SetDiasForm = ({userID, onCloseSetDias, diasPermitidos}: {userID: string, onCloseSetDias: () => void, diasPermitidos: number | null}) => {

const [diasDisponibles, setDiasDisponibles] = useState<number>(diasPermitidos || 0);
const [loading, setLoading] = useState(false);

const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch('/api/userCupo',{
            method:'PUT',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({userID,dias_permitidos:diasDisponibles})
        }

        )
        if(!response.ok){
            throw new Error('Error al actualizar los dias disponibles');
        }
        alert('Días disponibles actualizados con éxito');
        onCloseSetDias();
    } catch (error:unknown) {
        if(error instanceof Error){
            alert('Error al actualizar los dias disponibles: '+error.message);
        }
    }
}

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Setear días disponibles</h2>
    
        
    
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="dias_disponibles" className="block text-gray-700">
                  Días disponibles:
                </label>
                <input
                  type="number"
                  id="dias_disponibles"
                  name="dias_disponibles"
                  value={diasDisponibles}
                  onChange={(e)=>setDiasDisponibles(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
    
             
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={onCloseSetDias}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50' : 'hover:bg-blue-700'
                    }`}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )

}