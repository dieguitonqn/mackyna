'use client'

import React, { useState } from 'react';

const UserForm = () => {
  const [formData, setFormData] = useState({
    nombreApellido: '',
    apodo: '',
    telefono: '',
    emergencia: '',
    fechaNacimiento: '',
    edad: '',
    dni: '',
    localidad: '',
    barrio: '',
    profesion: '',
    hijos: '',
    correo: '',
    facebook: '',
    instagram: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Aquí puedes enviar los datos al backend
    alert('Formulario enviado');
  };

  return (
    <form 
      className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md" 
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        Formulario de Usuario
      </h2>
      
      {/* Contenedor de dos columnas en pantallas grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Nombre y Apellido</label>
          <input 
            type="text" 
            name="nombreApellido" 
            value={formData.nombreApellido} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Apodo</label>
          <input 
            type="text" 
            name="apodo" 
            value={formData.apodo} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Teléfono</label>
          <input 
            type="tel" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Tel. contacto de emergencia</label>
          <input 
            type="tel" 
            name="emergencia" 
            value={formData.emergencia} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Fecha de Nacimiento</label>
          <input 
            type="date" 
            name="fechaNacimiento" 
            value={formData.fechaNacimiento} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Edad</label>
          <input 
            type="number" 
            name="edad" 
            value={formData.edad} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">DNI</label>
          <input 
            type="number" 
            name="dni" 
            value={formData.dni} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Localidad</label>
          <input 
            type="text" 
            name="localidad" 
            value={formData.localidad} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Barrio</label>
          <input 
            type="text" 
            name="barrio" 
            value={formData.barrio} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Profesión / Trabajo</label>
          <input 
            type="text" 
            name="profesion" 
            value={formData.profesion} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Hijos</label>
          <input 
            type="text" 
            name="hijos" 
            value={formData.hijos} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Correo Electrónico</label>
          <input 
            type="email" 
            name="correo" 
            value={formData.correo} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Facebook</label>
          <input 
            type="text" 
            name="facebook" 
            value={formData.facebook} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-600">Instagram</label>
          <input 
            type="text" 
            name="instagram" 
            value={formData.instagram} 
            onChange={handleChange} 
            className="w-full p-2 border rounded-md" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="mt-6 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Enviar
      </button>
    </form>
  );
};

export default UserForm;
