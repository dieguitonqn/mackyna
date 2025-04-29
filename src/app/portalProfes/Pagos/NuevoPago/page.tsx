'use client';

import React, { use, useEffect, useState } from "react";
import { FormPagos } from "@/components/PortalProfes/pagos/formPagos";
import connect from "@/lib/db";
import { IUser } from "@/types/user";
import User from "@/lib/models/user";
import AutoCompleteInput from '@/components/AutocompleteUsers'
import { IConfigs } from "@/types/configs";


function NuevoPago() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [configs, setConfigs] = useState<IConfigs>();
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
        try {
          const response = await fetch("/api/configs");
          if (!response.ok) {
            throw new Error("Error al obtener configuraciones");
          }
          const data: IConfigs = await response.json();
          console.log(data);
          setConfigs(data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log("Error al obtener configuraciones: " + error.message);
          } else {
            console.log("Error desconocido");
          }
          
        }
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
    <div className="w-3/4 mx-auto justify-center">
      
      <AutoCompleteInput users={users} onSelect={handleSelect}/>
      
      {selectedUser && configs && <FormPagos user={selectedUser} configs={configs} />}
      
    </div>
  );
}

export default NuevoPago;
