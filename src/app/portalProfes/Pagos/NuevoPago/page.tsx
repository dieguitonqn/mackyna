'use client';

import React, { use, useEffect, useState } from "react";
import { FormPagos } from "@/components/PortalProfes/pagos/formPagos";
import connect from "@/lib/db";
import { IUser } from "@/types/user";
import User from "@/lib/models/user";
import AutoCompleteInput from '@/components/AutocompleteUsers'


function NuevoPago() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch("/api/usuarios");
        if (!response.ok) {
          throw new Error("Error al obtener usuarios");
        }
        const users: IUser[] = await response.json();
        setUsers(users);
        console.log(users);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error al consultar los usuarios: " + error.message);
        } else {
          console.log("Error desconocido");
        }
      }
    }
    getUsers();
  }, [])

  const handleSelect = (user: IUser) => {
         setSelectedUser(user)
     }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      
      <AutoCompleteInput users={users} onSelect={handleSelect} />
      Formulario de pago nuevo para {selectedUser?.nombre}
    </div>
  );
}

export default NuevoPago;
