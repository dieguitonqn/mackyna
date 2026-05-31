'use client';

import React, { Suspense } from 'react';
import Planillas from '@/components/PortalAlumnos/planillas';

const E2EPlanillasPage: React.FC = () => {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <Planillas />
    </Suspense>
  );
};

export default E2EPlanillasPage;