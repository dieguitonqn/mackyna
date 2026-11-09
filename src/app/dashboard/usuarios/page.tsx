'use client';

import EditUserForm from '@/components/EditUserForm';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type User = {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};

const Usuarios: React.FC = () => {
  const { data: session } = useSession();
  const canManageStaffAccounts = session?.user?.rol === 'admin';
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
  const [deletedUser, setDeletedUser] = useState<boolean | null>(null);

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
  }, [selectedEmail, deletedUser]);

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

  const handleEdit = (email: string) => {
    setSelectedEmail(email); // Guarda el email en el estado
  };

  const handleDelete = async (id: string) => {
    try {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar este usuario?");
        if (!isConfirmed) {
            return; // Si el usuario cancela, no se procede
        }
        const responseDel = await fetch(`/api/usuarios?id=${id}`,
            {
                method: 'DELETE'
            }
        );
        if (!responseDel.ok) {
            throw new Error('Error al borrar el usuario');
        }
        setDeletedUser(true);
        alert('Usuario borrado con éxito');
        setDeletedUser(false)
    } catch (err: unknown) {
        throw new Error('Error al borrar el usuario' + err);
    }

}

  return (
    <div className="mx-auto max-w-[1450px] px-1 py-4 text-slate-100 sm:px-2 sm:py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.07] pb-5">
        <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a9cf6a]">Mackyna · Administración</p><h1 className="text-2xl font-semibold tracking-tight text-white">Usuarios</h1><p className="mt-1 text-sm text-slate-500">Buscar y administrar las cuentas de la plataforma.</p></div>
      </div>

      {loading && <p className="rounded-xl border border-white/[0.07] bg-[#151b20] px-5 py-10 text-center text-sm text-slate-400">Cargando usuarios...</p>}
      {error && <p className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] p-4 text-sm text-rose-200">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151b20] text-sm">
            <thead>
              <tr className="bg-[#1c252b]">
                {['Nombre', 'Apellido', 'Email', 'Rol', 'Acciones'].map((heading, idx) => (
                  <th
                    key={idx}
                    className="border-b border-white/[0.07] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {heading}
                    {idx < 4 && (
                      <input
                        type="text"
                        className="mt-2 block w-full rounded-lg border border-white/10 bg-[#10171c] px-2.5 py-2 text-xs font-normal normal-case tracking-normal text-slate-200 outline-none placeholder:text-slate-600 focus:border-[#a9cf6a]/50"
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
                  className="border-b border-white/[0.05] text-slate-300 transition hover:bg-white/[0.035] last:border-b-0"
                >
                  <td className="px-2 py-2">{user.nombre}</td>
                  <td className="px-2 py-2">{user.apellido}</td>
                  <td className="px-2 py-2">{user.email}</td>
                  <td className="px-2 py-2">{user.rol}</td>
                  <td className="flex flex-col items-center gap-1 px-2 py-2">
                    {(user.rol === 'user' || canManageStaffAccounts) && (
                      <button
                        className="w-full rounded-lg bg-[#a6c961] px-2 py-1.5 text-xs font-semibold text-[#172018] transition hover:bg-[#badb7d]"
                        onClick={() => handleEdit(user.email)}
                      >
                        Editar
                      </button>
                    )}
                    {(user.rol === 'user' || canManageStaffAccounts) && (
                      <button className="w-full rounded-lg border border-rose-400/20 bg-rose-400/[0.08] px-2 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-400/[0.16]"
                      onClick={() => handleDelete(user._id)}>
                        Borrar
                      </button>
                    )}
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
