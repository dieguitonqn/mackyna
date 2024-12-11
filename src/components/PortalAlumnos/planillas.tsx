'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plani } from '@/types/plani';
import Image from 'next/image';

const Planillas: React.FC = () => {

const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [planillasUser, setPlanillasUser] = useState<Plani[] | null>(null);
  const [selectedPlani, setSelectedPlani] = useState<Plani | null>(null);


  useEffect(() => {
    const fetchPlanis = async () => {
      const plani_id = searchParams.get('id'); // Uso directo del hook aquí
      try {
        if (plani_id) {
          const response = await fetch(`/api/planillas?id=${plani_id}`);
          if (!response.ok) {
            throw new Error('Error obteniendo las planillas del usuario');
          }
          const planillas = await response.json();
          // console.log(planillas);
          setPlanillasUser(planillas);
        } else if (session) {
          const userId = session.user.id;
          const response = await fetch(`/api/planillas?id=${userId}`);
          if (!response.ok) {
            throw new Error('Error obteniendo las planillas del usuario');
          }
          const planillas = await response.json();
          // console.log(planillas);
          setPlanillasUser(planillas);
        } else {
          const response = await fetch(`/api/planillas`);
          if (!response.ok) {
            throw new Error('Error obteniendo las planillas del usuario');
          }
          const planillas = await response.json();
          // setPlanillasUser(planillas);
          console.log(planillas);
        }
      } catch (err: unknown) {
        console.error(err);
      }
    };
    fetchPlanis();
  }, [searchParams, session]); // Asegúrate de incluir las dependencias necesarias


  const handleViewPlanilla = (plani: Plani) => {
    setSelectedPlani(plani);
  };

  const closeModal = () => {
    setSelectedPlani(null);
  };


  return (
    <div className="min-h-screen p-4">
      <div className='flex justify-center'>
      <h1 className="text-4xl font-bold mb-4 text-gray-200 ">Planillas de entrenamiento</h1>
      </div>
      
      {planillasUser ? (
        <div className="flex flex-wrap border-black gap-10 ">
          {planillasUser.map((plani) => (
            <div 
              key={plani._id} 
              className="cursor-pointer border p-4 rounded-md  flex flex-col items-center bg-gray-200 hover:bg-lime-100  shadow-black shadow-sm" 
              onClick={() => handleViewPlanilla(plani)}
            >
              <div className=" flex items-center justify-center  mb-2 ">
                {/* Logo o imagen representativa */}
                <Image 
                src={"/planilla.png"}
                alt='logo planilla' 
                width={100}
                height={100}
                />
                {/* <span className="text-lg font-bold">{plani.month}/{plani.year}</span> */}
              </div>
              <p className="text-center">{plani.month} {plani.year}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando planillas...</p>
      )}

      {selectedPlani && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
            <div className='flex justify-end'>
            <button 
              className="relative top-0 right-2 text-red-500 font-bold text-2xl bg-gray-400 px-2 py-1" 
              onClick={closeModal}
            >
              X
            </button>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Planilla: {selectedPlani.month} {selectedPlani.year}</h2>
            {/* <p><strong>Email:</strong> {selectedPlani.email}</p> */}
            {/* <p><strong>Alumno:</strong> {selectedPlani.userId}</p> */}
            <p><strong>Fecha de inicio:</strong> {new Date(selectedPlani.startDate).toLocaleDateString()}</p>
            <p><strong>Fecha de fin:</strong> {new Date(selectedPlani.endDate).toLocaleDateString()}</p>

            {Object.entries({ Bloque1: selectedPlani.Bloque1, Bloque2: selectedPlani.Bloque2, Bloque3: selectedPlani.Bloque3, Bloque4: selectedPlani.Bloque4 }).map(([bloque, ejercicios]) => (
              ejercicios.length > 0 && (
                <div key={bloque} className="mt-4 bg-slate-100 rounded-md p-5 border"> 
                  <h3 className="text-lg font-bold">{bloque}</h3>
                  <ul className="list-disc pl-5">
                    {ejercicios.map((exercise, index) => (
                      <li key={index}>
                        <p><strong>Nombre:</strong> {exercise.name}</p>
                        <p><strong>Repeticiones:</strong> {exercise.reps}</p>
                        <p><strong>Series:</strong> {exercise.sets}</p>
                        {exercise.videoLink && (
                          <p><strong>Video:</strong> <a href={exercise.videoLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Ver</a></p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );

};


export default Planillas;
