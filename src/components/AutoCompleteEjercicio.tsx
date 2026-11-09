// import { ObjectId } from "mongodb";
import React, { useEffect, useState } from "react";

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
  initialValue: string;
}

const AutoCompleteInputEj: React.FC<AutoCompleteProps> = ({ ejercicios, onSelect, initialValue }) => {
  const [query, setQuery] = useState<string>(initialValue || "");
  const [filtered, setFiltered] = useState<Ejercicio[]>([]); // Usuarios filtrados
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Control del desplegable
  const [isValidSelection, setIsValidSelection] = useState<boolean>(true); // Control de selección válida

  useEffect(() => {
    setQuery(initialValue || "");
    setIsValidSelection(true);
    setShowDropdown(false);
    setFiltered([]);
  }, [initialValue]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Normalizar el valor ingresado eliminando acentos
    const normalizedValue = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    setQuery(value);

    // Validar si el valor ingresado corresponde a un ejercicio seleccionado
    const isExactMatch = ejercicios.some(ejercicio => ejercicio.nombre === value);
    setIsValidSelection(isExactMatch || value === "" || value === initialValue);

    // Filtrar usuarios que coincidan con el texto ingresado
    const filtered = ejercicios.filter((ejercicio) => {
      const normalizedNombre = ejercicio.nombre
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      return normalizedNombre.includes(normalizedValue);
    });
    setFiltered(filtered);

    // Mostrar o ocultar el desplegable
    setShowDropdown(value.length > 0 && filtered.length > 0);
  };

  const handleSelect = (ejercicio: Ejercicio) => {
    setQuery(ejercicio.nombre); // Colocar el nombre seleccionado en el campo
    setShowDropdown(false); // Cerrar el desplegable
    setIsValidSelection(true); // Marcar como selección válida
    onSelect(ejercicio); // Notificar al padre

  };

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar ejercicio..."
        className={`w-full rounded-lg bg-[#0b0e0c] px-4 py-2.5 text-slate-100 outline-none transition focus:ring-2 ${
          !isValidSelection ? 'border border-rose-400 focus:ring-rose-400/30' : 'border border-white/10 focus:border-[#b9dc75]/50 focus:ring-[#b9dc75]/20'
        }`}
        
      />
      {showDropdown && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#111713] text-slate-200 shadow-2xl">
          {filtered.map((ejercicio) => (
            <li
              key={ejercicio._id} // Convierte el ObjectId si es un objeto

              onClick={() => handleSelect(ejercicio)}
              className="cursor-pointer border-b border-white/[0.06] px-4 py-3 transition hover:bg-white/[0.06]"
            >
              <p className="font-semibold">{ejercicio.nombre}</p>

              <p className="mt-1 text-xs text-slate-400">{"Desc: " + ejercicio.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInputEj;
