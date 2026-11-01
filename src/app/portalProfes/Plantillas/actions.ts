'use server';

import connect from "@/lib/db";
import { ObjectId } from "mongodb";
import Plantilla from "@/lib/models/plantilla";
import { revalidatePath } from 'next/cache';
import { getActiveSession } from "@/lib/getActiveSession";

export async function deletePlantilla(id: string) {
    const session = await getActiveSession();
    if (!session) throw new Error('No autorizado');
    if (!['admin', 'teacher', 'teach'].includes(session.user?.rol ?? '')) {
        throw new Error('No autorizado');
    }
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        throw new Error('ID de plantilla inválido');
    }

    try {
        await connect();
        const deleted = await Plantilla.findByIdAndDelete(id).select('_id');
        if (!deleted) throw new Error('Plantilla no encontrada');
        revalidatePath('/portalProfes/Plantillas');
    } catch (error) {
        console.error('Error al eliminar la plantilla:', error);
        throw new Error('Error al eliminar la plantilla');
    }
}
