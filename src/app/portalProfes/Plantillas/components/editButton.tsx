import { FiEdit } from 'react-icons/fi'
import Link from 'next/link'
export const EditButton = ({ id }: { id: string }) => {
    return (
        <Link
        href={`/portalProfes/editPlani?plantillaID=${id}` }
            title="Editar plantilla"
            className="text-blue-400 hover:text-blue-300 hover:shadow-[0_3px_2px_-1px_rgba(100,100,255,0.9)] transition-colors"
        >
            <FiEdit size={18} />
        </Link>
    )
}