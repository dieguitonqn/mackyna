import React from "react";
import { CiCalendarDate } from "react-icons/ci";
import { GiBodyHeight } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { EditButton } from "./EditButton";


export const MetricCard = (
    {   
        userID,
        birthDate,
        altura,
        objetivo
    }:
        {
            userID: string,
            birthDate?: Date | null,
            altura?: number | 0,
            objetivo?: string
        }
) => {

    function calcularEdad(birthDate: Date) {
        if (!birthDate || birthDate=== null){
            return { años: 0, meses: 0 };
        }
        const fecha_hoy = new Date();
        let años = fecha_hoy.getFullYear() - birthDate.getFullYear();
        let meses = fecha_hoy.getMonth() - birthDate.getMonth();
        if (meses < 0) {
            años--;
            meses += 12;
        }
        return { años, meses };
    }
    
    const edad = calcularEdad(birthDate = birthDate as Date);
    console.log(userID);

    return (
        <div className="card bg-slate-200 p-5 rounded-md mx-10">
            <div className="flex flex-col gap-4">
                <h5 className="justify-center text-center text-2xl font-semibold shadow-sm shadow-lime-700">Datos del usuario</h5>
                <p className="card-text flex items-center gap-1"><CiCalendarDate className="h-8 w-5" /><span className="underline font-semibold">Edad:</span> {edad.años} años, {edad.meses} meses</p>
                <p className="card-text flex items-center gap-1"><GiBodyHeight className="h-8 w-5" /><span className="underline font-semibold">Altura:</span> {altura? altura : 0} m</p>
                <p className="card-text flex items-center gap-1"><GoGoal className="h-8 w-5" /><span className="underline font-semibold">Objetivo:</span> {objetivo}</p>
            </div>
            <EditButton userID={userID} fecha_nac={birthDate} />
        </div>
    )
}
