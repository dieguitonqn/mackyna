import React from "react";


export const MetricCard
    = () => {
        return (
            <div className="card bg-slate-200 p-5 rounded-md mx-10">
                <div className="flex flex-col gap-4">
                    <h5 className="justify-center text-center text-2xl font-semibold">Datos del usuario</h5>
                    <p className="card-text">Edad: años</p>
                    <p className="card-text">Altura:  m</p>
                    <p className="card-text">Objetivo: </p>
                </div>
            </div>
        )
    }
