'use client';

import React, { Suspense } from 'react';
import Planillas from '@/components/PortalAlumnos/planillas'; // Asegúrate de que la ruta sea correcta

const PlanillasPage: React.FC = () => {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <Planillas />
    </Suspense>
  );
};

export default PlanillasPage;

