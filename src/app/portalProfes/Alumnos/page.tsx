'use client';

import EditUserForm from '@/components/EditUserForm';
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
  // const [deletedUser, setDeletedUser] = useState<boolean | null>(null);

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
    const filtered = users.filter((user) =>
      user.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
      user.apellido.toLowerCase().includes(filters.apellido.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.rol.toLowerCase().includes(filters.rol.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (field: keyof User, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setSelectedEmail(null); // Cierra el formulario
  };

  // const handlePlanis = (email: string) => {
  //   setSelectedEmail(email); // Guarda el email en el estado
  // };


  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Lista de Usuarios</h1>

      {loading && <p className="text-center">Cargando usuarios...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                {['Nombre', 'Apellido', 'Email', 'Acciones'].map((heading, idx) => (
                  <th
                    key={idx}
                    className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                  >
                    {heading}
                    {idx < 4 && (
                      <input
                        type="text"
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder={`Filtrar por ${heading.toLowerCase()}`}
                        value={filters[heading.toLowerCase() as keyof User]}
                        onChange={(e) =>
                          handleFilterChange(
                            heading.toLowerCase() as keyof User,
                            e.target.value
                          )
                        }
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-200 border-b last:border-b-0"
                >
                  <td className="px-2 py-2">{user.nombre}</td>
                  <td className="px-2 py-2">{user.apellido}</td>
                  <td className="px-2 py-2">{user.email}</td>
                  
                  <td className="px-2 py-2 flex flex-row justify-center gap-1 items-center">
                    <a
                      className=" px-2 py-1 bg-green-600 text-white rounded-sm text-sm"
                      href={`../portalAlumnos/Planilla?id=${user._id}`}
                    >
                      Planillas
                    </a>
                    <a
                      className=" px-2 py-1 bg-blue-600 text-white rounded-sm text-sm"
                      href={`../portalAlumnos/Metricas?id=${user._id}`}
                    >
                      Metricas
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedEmail && (
            <EditUserForm email={selectedEmail} onClose={handleClose} />
          )}
        </div>
      )}
    </div>
  );
};

export default Usuarios;