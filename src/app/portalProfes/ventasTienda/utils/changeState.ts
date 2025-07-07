'use server';
import connect  from "@/lib/db";
import Venta from "@/lib/models/ventasTienda";

export default async function changeState(ventaId: string, newState: string) {
    try{
        await connect();
        const updatedVenta = await Venta.findByIdAndUpdate(
            ventaId,
            { state: newState },
            { new: true }
        );
        if (!updatedVenta) {
            console.error("Venta no encontrada o no se pudo actualizar");
            return false;
        }
        console.log("Estado de la venta actualizado:", updatedVenta);
        return true;

    }catch (error:unknown) {
        if (error instanceof Error) {
            console.error("Error al cambiar el estado de la venta:", error.message);
        } else {
            console.error("Error desconocido al cambiar el estado de la venta:", error);
        }
        return false;
    }
}