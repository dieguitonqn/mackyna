"use client";
import Confetti from "react-confetti";
import React, { useEffect } from "react";
import { useWindowSize } from "react-use";
function PagoSuccess() {
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/portalAlumnos/Pago';
    }, 3000); // Redirect after 3 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="flex justify-center items-center h-full w-full">
        <div className="text-center">
          <h1 className="font-bold text-6xl text-slate-200">¡Pago Aprobado!</h1>
          
        </div>
        <Confetti width={width} height={height} />
      </div>
    </div>
  );
}

export default PagoSuccess;
