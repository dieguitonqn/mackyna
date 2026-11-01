'use client';
import { FiTrash2 } from 'react-icons/fi';
import { deletePlantilla } from '../actions';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
    id: string;
    
}

export const DeleteButton = ({id}:DeleteButtonProps) => {
    const router = useRouter();

    return (
        <button
            title="Eliminar plantilla"
            className="text-red-400 hover:text-red-300 hover:shadow-[0_3px_2px_-1px_rgba(255,0,0,0.5)] transition-colors"
            onClick={async () => {
                const deleteOk = window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?');
                if (deleteOk) {
                    // Aquí iría la lógica para eliminar la plantilla
                    try {
                        await deletePlantilla(id);
                        router.refresh();
                    }catch (error:unknown) {
                        if (error instanceof Error) {
                            console.error(`Error al eliminar la plantilla con ID ${id}:`, error.message);
                        } else {
                            console.error(`Error al eliminar la plantilla con ID ${id}:`, error);
                        }
                        
                        alert('Error al eliminar la plantilla. Por favor, inténtalo de nuevo más tarde.');
                    }
                }
            }}

        >
            <FiTrash2 size={18} />
        </button>
    )
}
