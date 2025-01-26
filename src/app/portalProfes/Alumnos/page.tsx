'use client';

import EditUserForm from '@/components/EditUserForm';
import React, { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { SetDiasForm } from '@/components/PortalProfes/SetDiasForm';
import { useRouter } from 'next/navigation';
import { FaClipboardList, FaChartBar, FaKey, FaCalendarAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Tooltip from '@/components/PortalProfes/Tooltip';

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
  const router = useRouter();

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

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
      Object.entries(filters).every(([key, value]) => {
        const fieldValue = user[key as keyof IUser]?.toString() || '';
        const searchValue = value?.toString() || '';
        return normalizeString(fieldValue).includes(normalizeString(searchValue));
      })
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

  const handleToggleHabilitado = async (userId: string, estadoActual: boolean) => {
    const confirmar = window.confirm(
      `¿Estás seguro que deseas ${estadoActual ? 'deshabilitar' : 'habilitar'} a este usuario?`
    );

    if (confirmar) {
      try {
        const response = await fetch('/api/usuarios', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            habilitado: !estadoActual
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el estado del usuario');
        }

        setUsers(users.map(user => 
          user._id.toString() === userId ? { ...user, habilitado: !estadoActual } : user
        ));
        
        alert(`Usuario ${estadoActual ? 'deshabilitado' : 'habilitado'} correctamente`);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert('Error al actualizar el estado del usuario');
      }
    }
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
                  <td className="px-2 py-2 flex flex-row justify-center gap-3 items-center">
                    <Tooltip text="Ver Planillas">
                      <a
                        href={`../portalAlumnos/Planilla?id=${user._id}`}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <FaClipboardList className="h-5 w-5" />
                      </a>
                    </Tooltip>

                    <Tooltip text="Ver Métricas">
                      <a
                        href={`../portalAlumnos/Metricas?id=${user._id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaChartBar className="h-5 w-5" />
                      </a>
                    </Tooltip>

                    <Tooltip text="Resetear Contraseña">
                      <button
                        onClick={() => handleResetPwd(user._id.toString())}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaKey className="h-5 w-5" />
                      </button>
                    </Tooltip>

                    <Tooltip text="Configurar Días">
                      <button
                        onClick={() => {
                          setShowSetDias(!showSetDias)
                          setUserID(user._id.toString())
                          setDiasPermitidos(user.dias_permitidos || null)
                        }}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors"
                      >
                        <FaCalendarAlt className="h-5 w-5" />
                      </button>
                    </Tooltip>

                    <Tooltip text={user.habilitado ? 'Deshabilitar Usuario' : 'Habilitar Usuario'}>
                      <button
                        onClick={() => handleToggleHabilitado(user._id.toString(), user.habilitado || false)}
                        className={`${user.habilitado ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} transition-colors`}
                      >
                        {user.habilitado ? <FaToggleOn className="h-5 w-5" /> : <FaToggleOff className="h-5 w-5" />}
                      </button>
                    </Tooltip>
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
