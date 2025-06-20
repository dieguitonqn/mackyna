import React, { memo } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { GiBodyHeight } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { EditButton } from "./EditButton";
import { MdOutlinePersonalInjury } from "react-icons/md";

interface MetricCardProps {
  userID: string;
  birthDate?: Date | null;
  altura?: number;
  objetivo?: string;
  lesiones?: string;
}

const MetricCardComponent = ({
  userID,
  birthDate,
  altura = 0,
  objetivo,
  lesiones,
}: MetricCardProps) => {
  console.log("Renderizando MetricCardComponent");
  console.log('MetricCard rendering with birthDate:', birthDate);

  const calcularEdad = React.useCallback(
    (birthDate: Date | null | undefined) => {
      if (!birthDate) {
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
    },
    []
  );
  
  const edad = React.useMemo(
    () => calcularEdad(birthDate),
    [birthDate, calcularEdad]
  );

  return (
    <div className="card bg-slate-100 p-5 rounded-md mx-10 shadow-sm shadow-lime-700 border border-slate-200">
      <div className="flex flex-col gap-4">
        <h5 className="justify-center text-center text-2xl font-semibold shadow-sm shadow-lime-700">
          Datos del usuario
        </h5>
        <p className="card-text flex items-center gap-1">
          <CiCalendarDate className="h-8 w-5" />
          <span className="underline font-semibold">Edad:</span> {edad.años} años,{" "}
          {edad.meses} meses
        </p>
        <p className="card-text flex items-center gap-1">
          <GiBodyHeight className="h-8 w-5" />
          <span className="underline font-semibold">Altura:</span> {altura} m
        </p>
        <p className="card-text flex items-center gap-1">
          <GoGoal className="h-8 w-5" />
          <span className="underline font-semibold">Objetivo:</span> {objetivo}
        </p>
        <p className="card-text flex items-center gap-1">
          <MdOutlinePersonalInjury className="h-8 w-5" />
          <span className="underline font-semibold">Lesiones:</span> {lesiones}
        </p>
      </div>
      <EditButton userID={userID} fecha_nac={birthDate as Date} />
    </div>
  );
};

export const MetricCard = memo(MetricCardComponent);
