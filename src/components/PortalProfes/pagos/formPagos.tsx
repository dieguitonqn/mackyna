"use client";
import React, { useState, useEffect } from "react";
import { IUser } from "@/types/user";
import { IFormPago } from "@/types/pago";

export const FormPagos = ({ user }: { user: IUser }) => {
  const [pago, setPago] = useState<IFormPago>({
    userID: user._id.toString(),
    nombre: user.nombre+" "+user.apellido,
    email: user.email,
    fecha: new Date(),
    monto: 0,
    metodo: "",
    estado: "pendiente",
    comprobante: null,
    descripcion: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userID", user._id.toString());
      formData.append("nombre", user.nombre+" "+user.apellido);
      formData.append("email", user.email);
      formData.append("fecha", new Date().toISOString());
      formData.append("monto", pago.monto.toString());
      formData.append("metodo", pago.metodo);
      formData.append("estado", "pendiente");
      formData.append("descripcion", pago.descripcion || "");
      if (file) {
        formData.append("comprobante", file);
      }

      const response = await fetch("/api/pagos", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error al guardar el pago");
      }
      alert("Pago guardado correctamente");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error al guardar el pago: " + error.message);
      } else {
        console.log("Error desconocido");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (e.target.name === "comp") {
      const file = (e.target as HTMLInputElement).files?.[0];
      setFile(file || null);
    } else if (e.target.name === "desc") {
      setPago({
        ...pago,
        descripcion: e.target.value,
      });
    } else {
      setPago({
        ...pago,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 w-full md:w-1/2">
      <form className="mt-4 w-3/4 border border-slate-200 border-1 shadow-md rounded-sm p-5 ">
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <label
              htmlFor="monto"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Monto:
            </label>
            <input
              onChange={handleChange}
              type="number"
              name="monto"
              id="monto"
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="metodo"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Tipo:
            </label>
            <select
              onChange={handleChange}
              name="metodo"
              id="metodo"
              className="shadow bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="" >
                Seleccione un método de pago ...
              </option>
              <option value="transferencia">Transferencia</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="comp"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Comprobante:
            </label>
            <input
              onChange={handleChange}
              type="file"
              name="comp"
              id="comp"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-slate-500 hover:file:text-white"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="desc"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Descripción:
            </label>
            <textarea
              onChange={handleChange}
              name="desc"
              id="desc"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};
