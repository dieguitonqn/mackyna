'use client';

import React, { useEffect, useState } from 'react';

type User = {
  nombre: string;
  apellido: string;
  email: string;
};

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/usuarios');
        if (!response.ok) {
          throw new Error('Error al obtener usuarios');
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Lista de Usuarios</h1>

      {loading && <p className="text-center">Cargando usuarios...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Nombre</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Apellido</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{user.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.apellido}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
