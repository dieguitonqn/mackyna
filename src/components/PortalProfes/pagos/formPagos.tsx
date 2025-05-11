"use client";
import React, { useState } from "react";
import { IUser } from "@/types/user";
import { IFormPago } from "@/types/pago";
// import { IConfigs } from "@/types/configs";
import { FaRegFilePdf } from "react-icons/fa6";

export const FormPagos = ({ user }: { user: IUser}) => {
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
      formData.append("estado", "Aprobado");
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
      window.location.href = "/portalProfes/Pagos";
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

  const handleMontoChange = (monto: number) => {
    setPago({
      ...pago,
      monto: monto,
    });
  };

  return (
  <div className="container mx-auto p-1">
    <form className=" w-full md:max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Registrar Nuevo Pago</h2>
      
      {/* Sección Monto */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Monto
        </label>
        <div className="mt-1">
          <input
            type="number"
            value={pago.monto}
            onChange={(e) => handleMontoChange(Number(e.target.value))}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            placeholder="Ingrese el monto"
          />
        </div>
      </div>

      {/* Sección Método de Pago */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Método de Pago
        </label>
        <select
          onChange={handleChange}
          name="metodo"
          id="metodo"
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        >
          <option value="">Seleccione un método de pago...</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>
      </div>

      {/* Sección Comprobante */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Comprobante
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg dark:border-slate-600">
          <div className="space-y-1 text-center">
           
            <FaRegFilePdf className="text-gray-500 h-11 w-11 mx-auto "/>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="comp" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Cargar archivo (<strong>Solo PDF</strong>)</span>
                <input
                  id="comp"
                  name="comp"
                  type="file"
                  className="sr-only"
                  onChange={handleChange}
                />
              </label>
              <p className="pl-1 text-gray-500">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-gray-500"> PDF hasta 10MB</p>
          </div>
        </div>
      </div>

      {/* Sección Descripción */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="customDesc"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              onChange={(e) => {
                const buttons = document.getElementById("descButtons");
                const textarea = document.getElementById("desc");
                if (buttons && textarea) {
                  buttons.style.display = e.target.checked ? "none" : "flex";
                  textarea.style.display = e.target.checked ? "block" : "none";
                }
              }}
            />
            <label htmlFor="customDesc" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Descripción personalizada
            </label>
          </div>
        </div>

        <div id="descButtons" className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Clase Individual', 'Semana', 'Quincena', 'Hasta 3 Días', 'Libre'].map((desc) => (
            <button
              key={desc}
              type="button"
              onClick={() => setPago({ ...pago, descripcion: desc })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pago.descripcion === desc 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {desc}
            </button>
          ))}
        </div>

        <textarea
          onChange={handleChange}
          name="desc"
          id="desc"
          style={{ display: "none" }}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          placeholder="Ingrese una descripción personalizada"
          rows={4}
        ></textarea>
      </div>

      {/* Botón Submit */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Guardar Pago
        </button>
      </div>
    </form>
  </div>
  );
};
