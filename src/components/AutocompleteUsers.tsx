'use client'
import { IUser } from "@/types/user";
import { ObjectId } from "mongodb";
import React, { useState } from "react";

// interface User {
//   _id: ObjectId | string;
//   nombre: string;
//   apellido: string;
//   email: string;
//   pwd: string;
//   rol: string;
// }

interface AutoCompleteProps {
  users: IUser[];
  onSelect: (user: IUser) => void;
}

const AutoCompleteInput: React.FC<AutoCompleteProps> = ({ users, onSelect }) => {
  const [query, setQuery] = useState<string>(""); // Texto ingresado
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]); // Usuarios filtrados
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Control del desplegable
  // console.log(users);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Filtrar usuarios que coincidan con el texto ingresado
    const filtered = users.filter((user) =>
      user.nombre.toLowerCase().includes(value.toLowerCase() ) || user.apellido?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);

    // Mostrar o ocultar el desplegable
    setShowDropdown(value.length > 0 && filtered.length > 0);
  };

  const handleSelect = (user: IUser) => {
    setQuery(user.nombre); // Colocar el nombre seleccionado en el campo
    setShowDropdown(false); // Cerrar el desplegable
    onSelect(user); // Notificar al padre
  };

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar usuario..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 border border-gray-300 bg-white rounded-lg shadow-lg z-10 mt-1">
          {filteredUsers.map((user) => (
            <li
            key={typeof user._id === "object" ? user._id.toString() : user._id} // Convierte el ObjectId si es un objeto
              
              onClick={() => handleSelect(user)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b text-sm"
            >
              <p className="font-semibold">{user.nombre + ", " + user.apellido }</p>
              
              <p className="italic font-extralight text-sm">{" email: " + user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
