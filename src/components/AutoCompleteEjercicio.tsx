// import { ObjectId } from "mongodb";
import React, { useState } from "react";

type Ejercicio = {
  _id: string;
  nombre: string;
  grupoMusc: string;
  specificMusc: string;
  description: string;
  video: string;
};

interface AutoCompleteProps {
  ejercicios: Ejercicio[];
  onSelect: (ejercicio: Ejercicio) => void;
  initialValue:string;
}

const AutoCompleteInputEj: React.FC<AutoCompleteProps> = ({ ejercicios, onSelect, initialValue }) => {
  const [query, setQuery] = useState<string>(initialValue || "");
    const [filtered, setFiltered] = useState<Ejercicio[]>([]); // Usuarios filtrados
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Control del desplegable
  // console.log(users);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Filtrar usuarios que coincidan con el texto ingresado
    const filtered = ejercicios.filter((ejercicio) =>
      ejercicio.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filtered);

    // Mostrar o ocultar el desplegable
    setShowDropdown(value.length > 0 && filtered.length > 0);
  };

  const handleSelect = (ejercicio: Ejercicio) => {
    setQuery(ejercicio.nombre); // Colocar el nombre seleccionado en el campo
    setShowDropdown(false); // Cerrar el desplegable
    onSelect(ejercicio); // Notificar al padre

  };

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar ejercicio..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 border border-gray-300 bg-white rounded-lg shadow-lg z-10 mt-1">
          {filtered.map((ejercicio) => (
            <li
              key={ejercicio._id} // Convierte el ObjectId si es un objeto

              onClick={() => handleSelect(ejercicio)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {ejercicio.nombre + "," + " Desc: " + ejercicio.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInputEj;
