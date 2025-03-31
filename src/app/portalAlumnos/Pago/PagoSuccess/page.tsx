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
        <Confetti
          width={1920}
          height={1080}
         numberOfPieces={200}
         recycle={true}
         gravity={0.1}
         initialVelocityX={{ min: -10, max: 10 }}
         initialVelocityY={{ min: 10, max: 20 }}
         colors={["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]}
         opacity={1}
         
       />
          <h1 className="font-bold text-6xl text-slate-200">¡Pago Aprobado!</h1>
          
        </div>
       
      </div>
      
    </div>
  );
}

export default PagoSuccess;
