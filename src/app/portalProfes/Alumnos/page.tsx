'use client';

import EditUserForm from '@/components/EditUserForm';
import React, { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaClipboardList, FaChartBar, FaKey, FaToggleOn, FaToggleOff, FaUserCircle, FaTrash } from 'react-icons/fa';
import Tooltip from '@/components/PortalProfes/Tooltip';
import { formatDateOnlyEs } from '@/utils/dateOnly';

type FilteredUser = {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};
const dynamic = "force-dynamic"; // Para evitar el cacheo de la página
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
  const router = useRouter();
  const { data: session } = useSession();
  const canManageStaffAccounts = session?.user?.rol === 'admin';

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

  const handleResetPwd = async (id: string) => {
    const temporaryPassword = window.prompt('Ingresá una contraseña temporal nueva (mínimo 8 caracteres):');
    if (!temporaryPassword) return;
    if (temporaryPassword.length < 8 || temporaryPassword.length > 128) {
      window.alert('La contraseña debe tener entre 8 y 128 caracteres.');
      return;
    }
    try {
      const response = await fetch('/api/userP', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, pwd: temporaryPassword }),
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

  const handleSetScrollY = () => {
    const scrollY = window.scrollY;
    console.log('Guardando posición del scroll:', scrollY);
    if (scrollY > 0) {
      localStorage.setItem('scrollY', scrollY.toString());
    }
  };

  useEffect(() => {
    if (!loading && filteredUsers.length > 0) {
      const storedScrollY = localStorage.getItem('scrollY');
      console.log('Restaurando posición del scroll:', storedScrollY);
      if (storedScrollY) {
        // Damos tiempo a que el DOM se renderice completamente
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(storedScrollY, 10),
            behavior: 'smooth',
          });
          localStorage.removeItem('scrollY');
        }, 100);
      }
    }
  }, [loading, filteredUsers]);

  const handleDeleteUser = async (userId: string) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar este usuario?");
    if (!isConfirmed) return;
    const isConfirmed2 = window.confirm("¿Estás REALMENTE seguro de que deseas borrar este usuario?");
    if (!isConfirmed2) return;
    try {
      const response = await fetch(`/api/usuarios?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al borrar el usuario');
      }

      setUsers(users.filter(user => user._id.toString() !== userId));
      alert('Usuario borrado correctamente');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error al borrar el usuario');
    }
  };
  return (
    <div className="mx-auto w-full max-w-7xl py-2">
      <header className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9dc75]">Gestión del equipo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Alumnos</h1>
        <p className="mt-2 text-sm text-slate-400">Buscá perfiles y accedé rápidamente a sus rutinas, métricas y datos.</p>
      </header>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111713] px-5 py-4">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Total alumnos</span>
          <p className="mt-2 text-2xl font-semibold text-white">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#111713] px-5 py-4">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Alumnos activos</span>
          <p className="mt-2 text-2xl font-semibold text-[#c8e994]">{users.filter(user => user.habilitado).length}</p>
        </div>
        {users.length !== filteredUsers.length && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111713] px-5 py-4">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Resultados</span>
            <p className="mt-2 text-2xl font-semibold text-white">{filteredUsers.length}</p>
          </div>
        )}
      </div>

      {loading && <p className="rounded-2xl border border-white/[0.08] bg-[#111713] p-6 text-center text-sm text-slate-400">Cargando usuarios...</p>}
      {error && <p className="rounded-2xl border border-rose-300/15 bg-rose-400/[0.07] p-4 text-center text-sm text-rose-200">{error}</p>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111713] shadow-[0_18px_50px_-35px_rgba(0,0,0,0.9)]">
          <div className="overflow-x-auto">
          <table className="portal-profes-table min-w-[1050px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#172019] text-slate-200">
                {['Nombre', 'Apellido', 'Email', 'Última Planilla', 'Última medición', 'Cumpleaños', 'Acciones'].map(
                  (heading, idx) => (
                    <th
                      key={idx}
                      className="border-b border-white/[0.08] px-3 py-3 text-center font-medium"
                    >
                      {heading}
                      {idx < 3 && (
                        <input
                          type="text"
                          className="mt-2 block w-full rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-left text-xs font-normal text-white placeholder:text-slate-500 focus:border-[#b9dc75]/50 focus:outline-none focus:ring-2 focus:ring-[#b9dc75]/15"
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
                  className="border-b border-white/[0.06] text-slate-300 transition last:border-0 hover:bg-white/[0.035]"
                >
                  <td className="px-3 py-3 font-medium text-white">{user.nombre}</td>
                  <td className="px-3 py-3">{user.apellido || ''}</td>
                  <td className="px-3 py-3">{user.email}</td>

                  <td className="whitespace-nowrap px-3 py-3">
                    {user.ultima_plani
                      ? formatDateOnlyEs(user.ultima_plani, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                      : '---'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.ultima_metrica
                      ? formatDateOnlyEs(user.ultima_metrica, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                      : '---'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.fecha_nacimiento
                      ? formatDateOnlyEs(user.fecha_nacimiento, {
                        day: 'numeric',
                        month: 'long',
                      })
                      : '---'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex min-w-[190px] items-center justify-center gap-3">
                    <Tooltip text="Ver Planillas">
                      <Link
                        href={`../portalAlumnos/Planilla?id=${user._id}`}
                        aria-label={`Ver planillas de ${user.nombre} ${user.apellido || ''}`}
                        className="rounded-lg p-2 text-[#c8e994] transition hover:bg-[#c8e994]/10 hover:text-[#e0f5c2]"
                         onClick={handleSetScrollY}
                      >
                        <FaClipboardList className="h-4 w-4" />
                      </Link>
                    </Tooltip>

                    <Tooltip text="Ver Métricas">
                      <Link
                        href={`../portalAlumnos/Metricas?id=${user._id}`}
                        aria-label={`Ver métricas de ${user.nombre} ${user.apellido || ''}`}
                        className="rounded-lg p-2 text-sky-300 transition hover:bg-sky-300/10 hover:text-sky-200"
                       onClick={handleSetScrollY}
                      >
                        <FaChartBar className="h-4 w-4" />
                      </Link>
                    </Tooltip>

                    <Tooltip text="Ver Perfil">
                      <Link
                        href={`../portalAlumnos/Perfil?id=${user._id}`}
                        aria-label={`Ver perfil de ${user.nombre} ${user.apellido || ''}`}
                        className="rounded-lg p-2 text-cyan-300 transition hover:bg-cyan-300/10 hover:text-cyan-200"
                        onClick={handleSetScrollY}
                      >
                        <FaUserCircle className="h-4 w-4" />
                      </Link>
                    </Tooltip>

                    {(user.rol === 'user' || canManageStaffAccounts) && (
                      <Tooltip text="Resetear Contraseña">
                        <button
                          onClick={() =>{
                            const confirmar = window.confirm(
                              '¿Estás seguro que deseas resetear la contraseña de este usuario?'
                            );
                            if (confirmar) {
                              handleResetPwd(user._id.toString());
                            }
                          } }
                          aria-label={`Resetear contraseña de ${user.nombre} ${user.apellido || ''}`}
                          className="rounded-lg p-2 text-amber-300 transition hover:bg-amber-300/10 hover:text-amber-200"
                        >
                          <FaKey className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    )}

                    {(user.rol === 'user' || canManageStaffAccounts) && (
                      <>
                        <Tooltip text="Borrar Usuario">
                          <button
                            onClick={() => {
                              const confirmar = window.confirm(
                                '¿Estás seguro que deseas borrar este usuario?'
                              );
                              if (confirmar) {
                                handleDeleteUser(user._id.toString());
                              }
                            }}
                            aria-label={`Borrar usuario ${user.nombre} ${user.apellido || ''}`}
                            className="rounded-lg p-2 text-rose-300 transition hover:bg-rose-300/10 hover:text-rose-200"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </Tooltip>

                        <Tooltip text={user.habilitado ? 'Deshabilitar Usuario' : 'Habilitar Usuario'}>
                          <button
                            onClick={() => handleToggleHabilitado(user._id.toString(), user.habilitado || false)}
                            aria-label={`${user.habilitado ? 'Deshabilitar' : 'Habilitar'} usuario ${user.nombre} ${user.apellido || ''}`}
                            className={`${user.habilitado ? 'text-[#c8e994] hover:bg-[#c8e994]/10' : 'text-rose-300 hover:bg-rose-300/10'} rounded-lg p-2 transition-colors`}
                          >
                            {user.habilitado ? <FaToggleOn className="h-4 w-4" /> : <FaToggleOff className="h-4 w-4" />}
                          </button>
                        </Tooltip>
                      </>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {selectedEmail && (
            <EditUserForm email={selectedEmail} onClose={handleClose} />
          )}
        </div>
      )}
    </div>
  );
};

export default Usuarios;
