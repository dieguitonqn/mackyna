'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { NextResponse } from 'next/server';
import { error } from 'console';

type Plani = {
  userId: string;
  email: String;

  bloque1: string[];
  bloque2: string[];
  bloque3: string[];
  bloque4: string[];

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}

const Planillas: React.FC = () => {
  const searchParams = useSearchParams();
  const [planis, setPlanis] = useState<Plani>();
  // Si el URL tiene parámetros en el query busca por id. Esto es si viene desde la página de profesores
  useEffect(() => {
    const fetchPlanis = async () => {
      try {
        if (searchParams.get("id")) {
          const response = await fetch(`/api/planillas?id=${searchParams.get("id")}`
          )
          if (!response.ok) {
            throw new Error('Error obteniendo las planillas del usuario');
          }
          const planillas = await response.json();
          console.log(planillas)
          setPlanis(planillas);
        } else {
          const response = await fetch(`/api/planillas`);
          if (!response.ok) {
            throw new Error('Error obteniendo las planillas del usuario');
          }
          const planillas = await response.json();
          console.log(planillas)
          setPlanis(planillas);
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
