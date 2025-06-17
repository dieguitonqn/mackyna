'use client'
import React, { useState } from "react";
import { Exercise, TrainingDay } from "@/types/plani";
import {IPlantilla} from "@/types/plantilla";

interface AutoCompleteProps {
  plantillas: IPlantilla[];
  onSelect: (plantilla: IPlantilla) => void;
}

const AutoCompletePlantillas: React.FC<AutoCompleteProps> = ({ plantillas, onSelect }) => {
  const [query, setQuery] = useState<string>(""); 
  const [filteredPlantillas, setFilteredPlantillas] = useState<IPlantilla[]>([]); 
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isValidSelection, setIsValidSelection] = useState<boolean>(true);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Validar si el valor ingresado corresponde a una plantilla seleccionada
    const isExactMatch = plantillas.some(
      plantilla => plantilla.nombre === value
    );
    setIsValidSelection(isExactMatch || value === "");

    // Filtrar plantillas que coincidan con el texto ingresado
    const filtered = plantillas.filter((plantilla) =>
      plantilla.nombre.toLowerCase().includes(value.toLowerCase()) ||
      plantilla.descripcion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlantillas(filtered);

    // Mostrar o ocultar el desplegable
    setShowDropdown(value.length > 0 && filtered.length > 0);
  };

  const handleSelect = (plantilla: IPlantilla) => {
    setQuery(plantilla.nombre);
    setShowDropdown(false);
    setIsValidSelection(true);
    console.log("Plantilla desde auto:",plantilla);
    onSelect(plantilla);
  };

  return (
    <div className="relative w-full md:max-w-2xl mx-auto dark:bg-slate-800 rounded-xl shadow-lg p-1">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar plantilla..."
        className={`w-full px-4 py-2 ${
          !isValidSelection ? 'border-4 border-red-500 animate-pulse' : 'border border-gray-300'
        } bg-slate-900/80 text-slate-300 rounded-lg focus:outline-none focus:ring-2 ${
          !isValidSelection ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        }`}
        required
      />
      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 border-2 border-gray-300 bg-gray-800 text-gray-300 rounded-lg shadow-lg z-10 mt-1">
          {filteredPlantillas.map((plantilla, index) => (
            <li
              key={index}
              onClick={() => handleSelect(plantilla)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-gray-800 border-b text-sm"
            >
              <p className="font-semibold">{plantilla.nombre}</p>
              <p className="italic font-extralight text-sm">{plantilla.descripcion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompletePlantillas;
