import  connect  from "@/lib/db";
import Venta from "@/lib/models/ventasTienda";

export async function getVentas() {
    
    try {
        await connect();
        const ventas = await Venta.find({}).sort({ date: -1 }).exec();
        console.log("Ventas obtenidas:", ventas);
        return ventas;
    } catch (error:unknown) {
        if (error instanceof Error) {
            console.error("Error al obtener las ventas:", error.message);
        }
        else {
            console.error("Error desconocido al obtener las ventas:", error);
        
        }
        return [];
    }
}
