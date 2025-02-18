import React from "react";
import { FormPagos } from "@/components/PortalProfes/pagos/formPagos";
import connect from "@/lib/db";
import { IUser } from "@/types/user";
import User from "@/lib/models/user";

async function NuevoPago() {
  await connect();
  let users: IUser[] = [];
  try {
    users = await User.find();
    console.log(users);
    const usersWithStringId = users.map((user) => {
      return {
        
        _id: user._id.toString(),
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,

      };
    });
    console.log(usersWithStringId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error al consultar los usuarios: " + error.message);
    } else {
      console.log("Error desconocido");
    }
  }
  return (
    <div>
      <FormPagos user={users} />
    </div>
  );
}

export default NuevoPago;
