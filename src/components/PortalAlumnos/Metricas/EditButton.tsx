"use client";

import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdCancel, MdSave } from "react-icons/md";
import { parseDateOnlyToUTC, toDateInputValue } from "@/utils/dateOnly";

interface EditButtonProps {
  userID: string;
  fecha_nac ?: Date;
}

type EditMetricUser = {
  userID: string;
  fecha_nacimiento: Date | null;
  altura: number;
  objetivo: string;
  lesiones: string;
};

export const EditButton = ({ userID }: EditButtonProps) => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<EditMetricUser>({
    userID: userID,
    fecha_nacimiento: null,
    altura: 0,
    objetivo: "",
    lesiones: "",
  });

// console.log("fecha_nac",fecha_nac);
// console.log("fecha_nacimiento",user.fecha_nacimiento);
  useEffect(() => {
    // fetch user data
    const fetchUser = async () => {
      try {
        const userMetric = await fetch(`/api/usuarios?id=${userID}`);
        const user = await userMetric.json();
        setUser({
          ...user,
          fecha_nacimiento: user.fecha_nacimiento,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(id, value);
    setUser((prevUser) => {
      if (id === "altura") {
        return {
          ...prevUser,
          altura: parseFloat(value),
        };
      }

      if (id === "fecha_nacimiento") {
        return {
          ...prevUser,
          fecha_nacimiento: value ? parseDateOnlyToUTC(value) : null,
        };
      }

      return {
        ...prevUser,
        [id]: value,
      };
    });
    console.log(user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle form submission
    try {
      const response = await fetch(`/api/usuarios`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("Datos guardados correctamente");
        window.location.reload();
      }else{
        const errorMessage = await response.json();
        alert('Error al guardar los datos: ' + errorMessage.mensaje || 'Error desconocido');
      }
    } catch (error:unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }else{  
        
        alert("Error al guardar los datos");
      }

      
    }
    console.log(user);
    setEditing(false);
  };

  return (
    <div>
      <button
        type="button"
        className="mx-auto mt-1 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#b9dc75]/20 bg-[#b9dc75]/[0.1] px-3 py-2 text-sm font-medium text-[#d5ecb7] transition hover:bg-[#b9dc75]/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
        onClick={() => setEditing(true)}
      >
        <CiEdit className="h-5 w-5"/>
        <span className="mr-2">Editar</span>
        
      </button>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#111713] p-5 shadow-2xl sm:p-6">
            <p className="mb-5 text-xl font-semibold text-white">Editar datos personales</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
              <label htmlFor="fecha_nacimiento" className="mb-1 text-sm font-medium text-slate-300">Fecha de nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                className="rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                value={toDateInputValue(user.fecha_nacimiento)}
                onChange={handleInputChange}
              />
              </div>
              <div className="flex flex-col">
              <label htmlFor="altura" className="mb-1 text-sm font-medium text-slate-300">Altura</label>
              <input 
                type="number" 
                id="altura" 
                className="rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                value={user.altura} 
                onChange={handleInputChange}
              />
              </div>
              <div className="flex flex-col">
              <label htmlFor="objetivo" className="mb-1 text-sm font-medium text-slate-300">Objetivo</label>
              <input 
                type="text" 
                id="objetivo" 
                className="rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                value={user.objetivo} 
                onChange={handleInputChange}
              />
              </div>
              <div className="flex flex-col">
              <label htmlFor="lesiones" className="mb-1 text-sm font-medium text-slate-300">Observaciones</label>
              <input 
                type="text" 
                id="lesiones" 
                className="rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                value={user.lesiones} 
                onChange={handleInputChange}
              />
              </div>

              <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                onClick={() => {
                  setEditing(false);
                  
                }
                }
              >
                <MdCancel className="w-5 h-5" />
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex items-center gap-2 rounded-xl bg-[#b9dc75] px-4 py-2.5 text-sm font-semibold text-[#172016] transition hover:bg-[#c9e991] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
              >
                <MdSave className="w-5 h-5" />
                Guardar
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
