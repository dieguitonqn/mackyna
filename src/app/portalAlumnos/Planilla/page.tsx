'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
// import { Suspense } from 'react'
// import { NextResponse } from 'next/server';
// import { error } from 'console';

// type Plani = {
//   userId: string;
//   email: string;

//   bloque1: string[];
//   bloque2: string[];
//   bloque3: string[];
//   bloque4: string[];

//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
// }

const Planillas: React.FC = () => {
  function Search(){
    const searchParams = useSearchParams();
    return searchParams.get("id")
  }
  // const [planis, setPlanis] = useState<Plani>();
  // Si el URL tiene parámetros en el query busca por id. Esto es si viene desde la página de profesores
  useEffect(() => {
    const fetchPlanis = async () => {
      const plani_id = Search();
      try {
        if (plani_id) {
          const response = await fetch(`/api/planillas?id=${plani_id}`
          )
          if (!response.ok) {
            throw new Error('Error obteniendo las planillas del usuario');
          }
          const planillas = await response.json();
          console.log(planillas)
          // setPlanis(planillas);
        } else {
          const response = await fetch(`/api/planillas`);
          if (!response.ok) {
            throw new Error('Error obteniendo las planillas del usuario');
          }
          const planillas = await response.json();
          console.log(planillas)
          // setPlanis(planillas);
        }
      } catch (err: unknown) {
        console.log(err);
      }

    }
    fetchPlanis();
  }
    , [])



  return (
    <div className='min-h-screen'>
      Planillas
    </div>
  )
}

export default Planillas
