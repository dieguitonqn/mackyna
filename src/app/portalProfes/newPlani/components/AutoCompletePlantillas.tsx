'use client'
import React, { useState } from "react";
import {IPlantilla} from "@/types/plantilla";

interface AutoCompleteProps {
  plantillas: IPlantilla[];
  onSelect: (plantilla: IPlantilla) => void;
}

const AutoCompletePlantillas: React.FC<AutoCompleteProps> = ({ plantillas, onSelect }) => {
  // console.log("AutoCompletePlantillas rendering with plantillas:", plantillas);
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
    <div className="relative mx-auto w-full md:max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar plantilla..."
        className={`w-full rounded-xl bg-[#0b0e0c] px-4 py-3 text-slate-100 outline-none transition focus:ring-2 ${
          !isValidSelection ? 'border border-rose-400 focus:ring-rose-400/30' : 'border border-white/10 focus:border-[#b9dc75]/50 focus:ring-[#b9dc75]/20'
        }`}
        
      />
      {showDropdown && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#111713] text-slate-200 shadow-2xl">
          {filteredPlantillas.map((plantilla, index) => (
            <li
              key={index}
              onClick={() => handleSelect(plantilla)}
              className="cursor-pointer border-b border-white/[0.06] px-4 py-3 text-sm transition hover:bg-white/[0.06]"
            >
              <p className="font-semibold">{plantilla.nombre}</p>
              <p className="mt-1 text-xs text-slate-400">{plantilla.descripcion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompletePlantillas;
