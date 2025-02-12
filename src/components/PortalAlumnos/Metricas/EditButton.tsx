"use client";

import React, { useEffect, useState } from "react";

interface EditButtonProps {
  userID: string;
}

type EditMetricUser = {
  userID: string;
  fecha_nacimiento: Date | null;
  altura: number;
  objetivo: string;
};

export const EditButton = ({ userID }: EditButtonProps) => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<EditMetricUser>({
    userID: userID,
    fecha_nacimiento: null,
    altura: 0,
    objetivo: "",
  });

  useEffect(() => {
    // fetch user data
    const fetchUser = async () => {
      try {
        const userMetric = await fetch(`/api/usuarios?id=${userID}`);
        const user = await userMetric.json();
        setUser({
          ...user,
          fecha_nacimiento: user.fecha_nacimiento ? new Date(user.fecha_nacimiento) : null,
        });
        console.log(user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [userID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: id === "altura" ? parseFloat(value) : value,
    }));
    console.log(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle form submission
    setEditing(false);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setEditing(true)}>Editar</button>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label htmlFor="fecha_nacimiento" className="mb-1">Fecha de Nacimiento: </label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  className="border rounded p-2"
                  value={user.fecha_nacimiento?.toISOString().split("T")[0] || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="altura" className="mb-1">Altura: </label>
                <input 
                  type="number" 
                  id="altura" 
                  className="border rounded p-2"
                  value={user.altura} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="objetivo" className="mb-1">Objetivo: </label>
                <input 
                  type="text" 
                  id="objetivo" 
                  className="border rounded p-2"
                  value={user.objetivo} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
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
