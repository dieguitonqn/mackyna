'use client';

import { useState } from 'react';
import { FormUserValues } from '@/types/user';
import { redirect } from 'next/dist/server/api-utils';



const UserForm = ({ user }: { user: FormUserValues }) => {
  const [formValues, setFormValues] = useState<FormUserValues>({
    _id: user._id,
    nombre: user.nombre,
    apellido: user.apellido || "",
    genero: user.genero || "",
    fecha_nacimiento: user.fecha_nacimiento || null,
    localidad: user.localidad || "",
    telefono: user.telefono || "",
    email: user.email,
    pwd: user.pwd,
    rol: user.rol,
    altura: user.altura || 0,
    objetivo: user.objetivo || "",
    lesiones: user.lesiones || "",
    redes: {
      Facebook: user.redes?.Facebook || '',
      Instagram: user.redes?.Instagram || "",
      Twitter: user.redes?.Twitter || "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormValues({
      ...formValues,
      fecha_nacimiento: date,
    });
  };


  const handleRedesChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormValues({
      ...formValues,
      redes: {
        ...formValues.redes,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      
      const response = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        
        window.alert('Usuario actualizado correctamente');
      }
      

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }

    }

    // Aquí puedes realizar la lógica de envío del formulario 
    // (por ejemplo, hacer una petición a la API)
    // console.log(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="md:w-3/4 w-full  m-auto justify-between  space-y-4 bg-green-100/15 flex flex-col my-10 p-10">
      <div className='flex flex-wrap gap-4'>
        <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
          <h1 className='text-2xl'>Datos De Usuario</h1>
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold mt-5">
              email:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formValues.email || ''}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none text-sm"
              disabled
            />
          </div>


          <div className='flex justify-center my-2'>
            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
              Cambiar Contraseña
            </button>
          </div>

        </div>
        <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
          <h1 className='text-2xl'>Datos De contacto</h1>
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold mt-5">
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formValues.nombre || ''}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="apellido" className="block text-sm font-semibold mt-5">
              Apellido:
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formValues.apellido}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="fecha_nacimiento" className="block text-sm font-semibold mt-5">
              Fecha de Nacimiento:
            </label>
            {/* Aquí puedes integrar un componente de selección de fecha (por ejemplo, de una librería como 'react-datepicker') */}
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formValues.fecha_nacimiento ? formValues.fecha_nacimiento.toISOString().slice(0, 10) : ''}
              onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="localidad" className="block text-sm font-semibold mt-5">
              Localidad:
            </label>
            <input
              type="text"
              id="localidad"
              name="localidad"
              value={formValues.localidad}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-semibold mt-5">
              Telefono:
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formValues.telefono}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
          <h1 className='text-2xl'>Datos De Deportivos</h1>
          <div>
            <label htmlFor="altura" className="block text-sm font-semibold mt-5">
              Altura(m):
            </label>
            <input
              type="Number"
              id="altura"
              name="altura"
              value={formValues.altura}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="altura" className="block text-sm font-semibold mt-5">
              Género:
            </label>
            <select
              id="genero"
              name="genero"
              value={formValues.genero || ''}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="no_binario">No binario</option>
            </select>
          </div>

          <div>
            <label htmlFor="objetivo" className="block text-sm font-semibold mt-5">
              Objetivo:
            </label>
            <input
              type="text"
              id="objetivo"
              name="objetivo"
              value={formValues.objetivo}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lesiones" className="block text-sm font-semibold mt-5">
              Lesiones:
            </label>
            <input
              type="text"
              id="lesiones"
              name="lesiones"
              value={formValues.lesiones}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
          <h1 className='text-2xl'>Redes</h1>
          <div>
            <label htmlFor="Facebook" className="block text-sm font-semibold mt-5">
              Facebook:
            </label>
            <input
              type="text"
              id="Facebook"
              name="Facebook"
              value={formValues.redes?.Facebook}
              onChange={handleRedesChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="Instagram" className="block text-sm font-semibold mt-5">
              Instagram:
            </label>
            <input
              type="text"
              id="Instagram"
              name="Instagram"
              value={formValues.redes?.Instagram}
              onChange={handleRedesChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="Twitter" className="block text-sm font-semibold mt-5">
              Twitter:
            </label>
            <input
              type="text"
              id="Twitter"
              name="Twitter"
              value={formValues.redes?.Twitter}
              onChange={handleRedesChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>


      <div className='flex justify-center mx-auto'>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Guardar
        </button>
      </div>

    </form>
  );
};

export default UserForm;