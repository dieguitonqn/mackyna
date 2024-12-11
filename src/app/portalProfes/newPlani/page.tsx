'use client';

import React, { useEffect, useState } from 'react';
// import { createPlan } from '@/services/api';
import { Plani, Exercise } from '@/types/plani';
import ExerciseForm from '@/components/ExerciseForm';
import AutoCompleteInput from '@/components/AutocompleteUsers';
import { ObjectId } from 'mongodb';
import User from '@/lib/models/user';

interface User {
  _id: ObjectId | string;
  nombre: string;
  apellido: string;
  email: string;
  pwd: string;
  rol: string;
}

const NewPlan: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null); // Estado de usuarios
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/usuarios');
        const usersDB = await response.json();
        const usersWithStringId = usersDB.map((user: User) => ({
          ...user,
          id: user._id.toString(), // Convertir ObjectId a string
        }));

        setUsers(usersWithStringId);
        // console.log(usersWithStringId);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
      }
    };
    fetchUsers();
  }, []);

  const [plan, setPlan] = useState<Plani>({
    month: '',
    year: '',
    userId: '',
    email: '',
    Bloque1: [],
    Bloque2: [],
    Bloque3: [],
    Bloque4: [],
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Por favor, selecciona un usuario.');
      return;
    }
    console.log(plan)
    try {
      const response = await fetch('/api/planillas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...plan }),
      });

      if (!response.ok) throw new Error('Error al crear la planilla');
      alert('Planilla creada exitosamente');
    } catch (error) {
      console.error(error);
      alert('Error al crear la planilla');
    }
  };

  const handleExerciseChange = (bloque: string, exercises: Exercise[]) => {
    setPlan((prevPlan) => ({ ...prevPlan, [bloque]: exercises }));
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setPlan((prevPlan) => ({ ...prevPlan, userId: user._id.toString(), email: user.email }));
    console.log('Usuario seleccionado:', user);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl my-5">Crear Nueva Planilla</h1>
      <form onSubmit={handleSubmit} className="w-full ">
        <div className="flex flex-wrap justify-center items-center gap-2 mb-5 max-w-3xl m-auto">
          {users && (
            <AutoCompleteInput users={users} onSelect={handleSelectUser} />
          )}
          <select
            value={plan.month}
            onChange={(e) =>
              setPlan((prevPlan) => ({ ...prevPlan, month: e.target.value }))
            }
            className="border p-2 rounded-md"
            required
          >
            <option value="" disabled>
              Selecciona un mes
            </option>
            <option value="Enero">Enero</option>
            <option value="Febrero">Febrero</option>
            <option value="Marzo">Marzo</option>
            <option value="Abril">Abril</option>
            <option value="Mayo">Mayo</option>
            <option value="Junio">Junio</option>
            <option value="Julio">Julio</option>
            <option value="Agosto">Agosto</option>
            <option value="Septiembre">Septiembre</option>
            <option value="Octubre">Octubre</option>
            <option value="Noviembre">Noviembre</option>
            <option value="Diciembre">Diciembre</option>
          </select>
          <select
            value={plan.year}
            onChange={(e) =>
              setPlan((prevPlan) => ({ ...prevPlan, year: e.target.value }))
            }
            className="border p-2 rounded-md"
            required
          >
            <option value="" disabled>
              Selecciona el año
            </option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select>

        
          <br />
          

        </div>
        <div className='flex justify-center items-center gap-5'>
        <div className='flex flex-col'>
            <label htmlFor='startDate'>
              Fecha de comienzo
            </label>

            <input
              id="startDate"
              type="date"
              placeholder="Fecha de finalización"
              value={plan.startDate}
              onChange={(e) =>
                setPlan((prevPlan) => ({ ...prevPlan, startDate: e.target.value }))
              }
              className="border p-2 rounded-md"
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='endDate'>
              Fecha de Finalización
            </label>

            <input
              id="endDate"
              type="date"
              placeholder="Fecha de finalización"
              value={plan.endDate}
              onChange={(e) =>
                setPlan((prevPlan) => ({ ...prevPlan, endDate: e.target.value }))
              }
              className="border p-2 rounded-md"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-4">
          <ExerciseForm bloque="Bloque1" onChange={handleExerciseChange} />
          <ExerciseForm bloque="Bloque2" onChange={handleExerciseChange} />
          <ExerciseForm bloque="Bloque3" onChange={handleExerciseChange} />
          <ExerciseForm bloque="Bloque4" onChange={handleExerciseChange} />
        </div>

        <div className="flex justify-center mt-5">
          <button
            type="submit"
            className="bg-emerald-500/50 py-2 px-4 rounded-md shadow-md shadow-gray-300 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPlan;
