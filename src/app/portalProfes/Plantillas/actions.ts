'use server';

import connect from "@/lib/db";
import Plantilla from "@/lib/models/plantilla";
import { revalidatePath } from 'next/cache';

export async function deletePlantilla(id: string) {
    try {
        await connect();
        await Plantilla.findByIdAndDelete(id);
        revalidatePath('/portalProfes/Plantillas');
    } catch (error) {
        console.error('Error al eliminar la plantilla:', error);
        throw new Error('Error al eliminar la plantilla');
    }
}
