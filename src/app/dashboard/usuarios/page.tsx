import React from 'react';
import FetchUsers from '@/lib/fetchUsers';

async function Usuarios() {
  const users = await FetchUsers();
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Lista de Usuarios</h1>
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
              <tr
                key={user.email}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="border border-gray-300 px-4 py-2">{user.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{user.apellido}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  // <div>Hola</div>
  );
}

export default Usuarios;
