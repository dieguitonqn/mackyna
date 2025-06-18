'use client';
import { FiTrash2 } from 'react-icons/fi';
import { deletePlantilla } from '../actions';

interface DeleteButtonProps {
    id: string;
    
}

export const DeleteButton = ({id}:DeleteButtonProps) => {
    return (
        <button
            title="Eliminar plantilla"
            className="text-red-400 hover:text-red-300 hover:shadow-[0_3px_2px_-1px_rgba(255,0,0,0.5)] transition-colors"
            onClick={() => {
                const deleteOk = window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?');
                if (deleteOk) {
                    // Aquí iría la lógica para eliminar la plantilla
                    try{
                        deletePlantilla(id);
                    }catch (error:unknown) {
                        if (error instanceof Error) {
                            console.error(`Error al eliminar la plantilla con ID ${id}:`, error.message);
                        } else {
                            console.error(`Error al eliminar la plantilla con ID ${id}:`, error);
                        }
                        
                        alert('Error al eliminar la plantilla. Por favor, inténtalo de nuevo más tarde.');
                    }

                    console.log('Plantilla eliminada');
                    console.log(`ID de la plantilla a eliminar: ${id}`);
                }
            }}

        >
            <FiTrash2 size={18} />
        </button>
    )
}