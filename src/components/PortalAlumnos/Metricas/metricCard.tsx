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
    <section className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#111713] p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.9)] sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8e994]">Tu perfil</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Datos personales</h2>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <MetricItem icon={<CiCalendarDate aria-hidden="true" />} label="Edad" value={`${edad.años} años, ${edad.meses} meses`} />
        <MetricItem icon={<GiBodyHeight aria-hidden="true" />} label="Altura" value={`${altura} m`} />
        <MetricItem icon={<GoGoal aria-hidden="true" />} label="Objetivo" value={objetivo || "Sin especificar"} />
        <MetricItem icon={<MdOutlinePersonalInjury aria-hidden="true" />} label="Observaciones" value={lesiones || "Sin observaciones"} />
      </div>
      <div className="mt-5 border-t border-white/[0.07] pt-4">
        <EditButton userID={userID} fecha_nac={birthDate as Date} />
      </div>
    </section>
  );
};

function MetricItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#b9dc75]/[0.1] text-lg text-[#c8e994]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-100">{value}</p>
      </div>
    </div>
  );
}

export const MetricCard = memo(MetricCardComponent);
