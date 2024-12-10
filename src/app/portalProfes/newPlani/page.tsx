'use client';

import React, { useEffect, useState } from 'react';
// import { createPlan } from '@/services/api';
import { Plani, Exercise } from '@/types/plani';
import ExerciseForm from '@/components/ExerciseForm';
import AutoCompleteInput from '@/components/AutocompleteUsers';
import { ObjectId } from 'mongodb';

interface User {
  id: ObjectId | string;
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
        const usersWithStringId = usersDB.map((user: any) => ({
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
    bloque1: [],
    bloque2: [],
    bloque3: [],
    bloque4: [],
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
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...plan, userId: selectedUser.id }),
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
    setPlan((prevPlan) => ({ ...prevPlan, userId: user.id.toString(), email: user.email }));
    console.log('Usuario seleccionado:', user);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl my-5">Crear Nueva Planilla</h1>
      <form onSubmit={handleSubmit} className="w-full ">
        <div className="flex justify-center gap-2 mb-5 max-w-3xl m-auto">
          {users && (
            <AutoCompleteInput users={users} onSelect={handleSelectUser} />
          )}
          <input
            type="text"
            placeholder="Mes"
            value={plan.month}
            onChange={(e) =>
              setPlan((prevPlan) => ({ ...prevPlan, month: e.target.value }))
            }
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Año"
            value={plan.year}
            onChange={(e) =>
              setPlan((prevPlan) => ({ ...prevPlan, year: e.target.value }))
            }
            className="border p-2 rounded-md"
          />
        </div>

        <div className="flex flex-wrap justify-center items-start gap-4">
          <ExerciseForm bloque="bloque1" onChange={handleExerciseChange} />
          <ExerciseForm bloque="bloque2" onChange={handleExerciseChange} />
          <ExerciseForm bloque="bloque3" onChange={handleExerciseChange} />
          <ExerciseForm bloque="bloque4" onChange={handleExerciseChange} />
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
