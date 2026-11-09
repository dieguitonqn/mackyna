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
    <div className="relative mx-auto w-full md:max-w-2xl">
      <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Buscar usuario..."
      className={`w-full rounded-xl bg-[#0b0e0c] px-4 py-3 text-slate-100 outline-none transition focus:ring-2 ${
        !isValidSelection ? 'border border-rose-400 focus:ring-rose-400/30' : 'border border-white/10 focus:border-[#b9dc75]/50 focus:ring-[#b9dc75]/20'
      }`}
      required
      />
      {showDropdown && (
      <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#111713] text-slate-200 shadow-2xl">
        {filteredUsers.map((user) => (
        <li
        key={typeof user._id === "object" ? user._id.toString() : user._id}
          onClick={() => handleSelect(user)}
          className="cursor-pointer border-b border-white/[0.06] px-4 py-3 text-sm transition hover:bg-white/[0.06]"
        >
          <p className="font-semibold">{user.nombre + ", " + user.apellido }</p>
          <p className="mt-1 text-xs text-slate-400">{"Email: " + user.email}</p>
        </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
