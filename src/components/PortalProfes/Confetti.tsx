'use client';

import Confetti from "react-confetti";
import React from "react";


export const ConfettiComponent = ({repeat}:{repeat:boolean}) => {
    return (
        <div>
            <Confetti
          width={1920}
          height={1080}
         numberOfPieces={200}
         recycle={repeat}
         gravity={0.1}
         initialVelocityX={{ min: -10, max: 10 }}
         initialVelocityY={{ min: 10, max: 20 }}
         colors={["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]}
         opacity={1}
         
       />
        </div>
    )}