'use client'
import { IUser } from "@/types/user";
// import { ObjectId } from "mongodb";
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
  const [isValidSelection, setIsValidSelection] = useState<boolean>(true); // Control de selección válida
  // console.log(users);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Validar si el valor ingresado corresponde a un usuario seleccionado
    const isExactMatch = users.some(
      user => (user.nombre + ", " + user.apellido) === value
    );
    setIsValidSelection(isExactMatch || value === "");

    // Filtrar usuarios que coincidan con el texto ingresado
    const filtered = users.filter((user) =>
      user.nombre.toLowerCase().includes(value.toLowerCase() ) || user.apellido?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);

    // Mostrar o ocultar el desplegable
    setShowDropdown(value.length > 0 && filtered.length > 0);
  };

  const handleSelect = (user: IUser) => {
    setQuery(user.nombre + ", " + user.apellido); // Colocar el nombre completo en el campo
    setShowDropdown(false); // Cerrar el desplegable
    setIsValidSelection(true); // Marcar como selección válida
    onSelect(user); // Notificar al padre
  };

  return (
    <div className="relative w-full md:max-w-2xl mx-auto dark:bg-slate-800 rounded-xl shadow-lg p-1">
      <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Buscar usuario..."
      className={`w-full px-4 py-2 ${
        !isValidSelection ? 'border-4 border-red-500 animate-pulse' : 'border border-gray-300'
      } bg-slate-900/80 text-slate-300 rounded-lg focus:outline-none focus:ring-2 ${
        !isValidSelection ? 'focus:ring-red-500' : 'focus:ring-blue-500'
      }`}
      required
      />
      {showDropdown && (
      <ul className="absolute top-full left-0 right-0 border-2 border-gray-300 bg-gray-800 text-gray-300 rounded-lg shadow-lg z-10 mt-1">
        {filteredUsers.map((user) => (
        <li
        key={typeof user._id === "object" ? user._id.toString() : user._id}
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
