'use client';

import EditUserForm from '@/components/EditUserForm';
import React, { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { SetDiasForm } from '@/components/PortalProfes/SetDiasForm';

type FilteredUser = {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<FilteredUser>>({
    _id: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSetDias, setShowSetDias] = useState<boolean>(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [diasPermitidos, setDiasPermitidos] = useState<number | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/usuarios');
        if (!response.ok) {
          throw new Error('Error al obtener usuarios');
        }
        const data: IUser[] = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError('Error al obtener usuarios. Intente nuevamente más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.entries(filters).every(([key, value]) =>
        user[key as keyof IUser]
          ?.toString()
          .toLowerCase()
          .includes(value?.toLowerCase() || '')
      )
    );
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (field: keyof FilteredUser, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setSelectedEmail(null);
  };

  const handleCloseDias = () => {
    setShowSetDias(false);
    setUserID(null);
  }

  

  const handleResetPwd = async (id: string) => {
    try {
      const response = await fetch('/api/userP', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, pwd: "1234" }),
      });
      if (!response.ok) {
        throw new Error('Error al resetear la contraseña');
      }
      alert('Contraseña reseteada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al resetear la contraseña');
    };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Listado de Alumnos</h1>

      {loading && <p className="text-center">Cargando usuarios...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                {['Nombre', 'Apellido', 'Email', 'Última Planilla', 'Última medición', 'Acciones'].map(
                  (heading, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                    >
                      {heading}
                      {idx < 3 && (
                        <input
                          type="text"
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder={`Filtrar por ${heading.toLowerCase()}`}
                          value={
                            filters[heading.toLowerCase() as keyof FilteredUser] || ''
                          }
                          onChange={(e) =>
                            handleFilterChange(
                              heading.toLowerCase() as keyof FilteredUser,
                              e.target.value
                            )
                          }
                        />
                      )}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-200 border-b last:border-b-0"
                >
                  <td className="px-2 py-2">{user.nombre}</td>
                  <td className="px-2 py-2">{user.apellido || ''}</td>
                  <td className="px-2 py-2">{user.email}</td>

                  <td className="px-2 py-2">
                    {user.ultima_plani
                      ? new Date(user.ultima_plani).toLocaleDateString()
                      : '---'}
                  </td>
                  <td className="px-2 py-2">
                    {user.ultima_metrica
                      ? new Date(user.ultima_metrica).toLocaleDateString()
                      : '---'}
                  </td>
                  <td className="px-2 py-2 flex flex-row justify-center gap-2 items-center">
                    <a
                      className="px-2 py-1 bg-green-600 text-white rounded-sm text-sm"
                      href={`../portalAlumnos/Planilla?id=${user._id}`}
                    >
                      Planillas
                    </a>
                    <a
                      className="px-2 py-1 bg-blue-600 text-white rounded-sm text-sm"
                      href={`../portalAlumnos/Metricas?id=${user._id}`}
                    >
                      Métricas
                    </a>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded-sm text-sm"
                      onClick={() => handleResetPwd(user._id.toString())}
                    >Reset PWD</button>
                    
                    <button
                      className='px-2 py-1 bg-yellow-600 text-white rounded-sm text-sm'
                      onClick={() => {
                        setShowSetDias(!showSetDias)
                        setUserID(user._id.toString())
                        setDiasPermitidos(user.dias_permitidos || null)
                      }}
                    >
                      Set días
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedEmail && (
            <EditUserForm email={selectedEmail} onClose={handleClose} />
          )}
          {showSetDias && (
            <SetDiasForm userID={userID!} diasPermitidos={diasPermitidos!} onCloseSetDias={handleCloseDias} />
          )}
        </div>
      )}
    </div>
  );
};

export default Usuarios;
