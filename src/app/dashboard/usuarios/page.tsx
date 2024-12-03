'use client';

import EditUserForm from '@/components/EditUserForm';
import { requestToBodyStream } from 'next/dist/server/body-streams';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

type User = {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    _id: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
  });
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
        setFilteredUsers(data);
      } catch (err: unknown) {
        setError('Error: ' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedEmail]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
      user.apellido.toLowerCase().includes(filters.apellido.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.rol.toLowerCase().includes(filters.rol.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (field: keyof User, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setSelectedEmail(null); // Cierra el formulario
  };

  const handleEdit = (email: string) => {
    // router.push(`/editar-usuario?email=${encodeURIComponent(email)}`);
    setSelectedEmail(email); // Guarda el email en el estado
  };
  requestToBodyStream

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
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                  Nombre
                  <input
                    type="text"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Filtrar por nombre"
                    value={filters.nombre}
                    onChange={(e) => handleFilterChange('nombre', e.target.value)}
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                  Apellido
                  <input
                    type="text"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Filtrar por apellido"
                    value={filters.apellido}
                    onChange={(e) => handleFilterChange('apellido', e.target.value)}
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                  Email
                  <input
                    type="text"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Filtrar por email"
                    value={filters.email}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                  Rol
                  <input
                    type="text"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Filtrar por rol"
                    value={filters.rol}
                    onChange={(e) => handleFilterChange('rol', e.target.value)}
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">
                  Acciones

                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-200">
                  <td className="border border-gray-300 px-4 py-2">{user.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.apellido}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.rol}</td>
                  <td className="border border-gray-300 px-4 py-2 justify-center items-center flex" onClick={() => handleEdit(user.email)}><button className='px-2 py-1 mx-2 bg-green-600 rounded-sm' onClick={() => handleEdit(user.email)}>Editar</button>|<button className='px-2 py-1 mx-2 bg-green-600 rounded-sm'>Borrar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedEmail && (
            <>
              <EditUserForm email={selectedEmail} onClose={handleClose}/>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Usuarios;
