"use client";

import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdCancel, MdSave } from "react-icons/md";

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
    setUser((prevUser) => ({
      ...prevUser,
      [id]: id === "altura" ? parseFloat(value) : value,
      [id]: id === "fecha_nacimiento" ? new Date(value) : value,
    }));
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
        className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 gap-2 mx-auto mt-2"
        onClick={() => setEditing(true)}
      >
        <CiEdit className="h-5 w-5"/>
        <span className="mr-2">Editar</span>
        
      </button>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
              <label htmlFor="fecha_nacimiento" className="mb-1 font-medium text-gray-700">Fecha de Nacimiento: </label>
              <input
                type="date"
                id="fecha_nacimiento"
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-200"
                value={user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toISOString().slice(0, 10) : ""}
                onChange={handleInputChange}
              />
              </div>
              <div className="flex flex-col">
              <label htmlFor="altura" className="mb-1 font-medium text-gray-700">Altura: </label>
              <input 
                type="number" 
                id="altura" 
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-200"
                value={user.altura} 
                onChange={handleInputChange}
              />
              </div>
              <div className="flex flex-col">
              <label htmlFor="objetivo" className="mb-1 font-medium text-gray-700">Objetivo: </label>
              <input 
                type="text" 
                id="objetivo" 
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-200"
                value={user.objetivo} 
                onChange={handleInputChange}
              />
              </div>
              <div className="flex flex-col">
              <label htmlFor="lesiones" className="mb-1 font-medium text-gray-700">Lesiones: </label>
              <input 
                type="text" 
                id="lesiones" 
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-200"
                value={user.lesiones} 
                onChange={handleInputChange}
              />
              </div>

              <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 gap-2 transition duration-200 shadow-sm"
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
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 gap-2 transition duration-200 shadow-sm"
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
