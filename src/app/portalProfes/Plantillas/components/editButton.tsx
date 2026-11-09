import { FiEdit } from 'react-icons/fi'
import Link from 'next/link'
export const EditButton = ({ id }: { id: string }) => {
    return (
        <Link
        href={`/portalProfes/editPlani?plantillaID=${id}`}
            title="Editar plantilla"
            aria-label="Editar plantilla"
            className="rounded-lg p-2 text-[#c8e994] transition hover:bg-[#b9dc75]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
        >
            <FiEdit size={18} />
        </Link>
    )
}
