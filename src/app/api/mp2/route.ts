import { Payment } from "mercadopago";
import { mpClient } from "../mp/route";
import { IUser } from "@/types/user";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";

// ---------------------------------------------------------------------
// Este script es para recibir las notificaciones de MercadoPago.
// ---------------------------------------------------------------------

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = await request.json();

  try {
    // Obtenemos el pago
    const payment = await new Payment(mpClient).get({ id: body.data.id });

    // Si se aprueba, agregamos el mensaje
    if (payment.status === "approved") {
      // Obtenemos los datos
      console.log(payment);
      const { external_reference, transaction_amount } = payment;
      console.log(
        `Pago aprobado por ${external_reference} por un monto de ${transaction_amount}`
      );

      // Hay que actualizar la base de datos con el pago aprobado

      const userID = payment.metadata.id;
      console.log(userID);
      // Aquí se puede hacer una llamada a la base de datos para actualizar el pago
      try {
        
        // Actualizamos el pago
        await User.updateOne(
          { _id: new ObjectId(userID as string) },
          { $set: { ultimo_pago: new Date() } }
        );
        const user: IUser | null = await User.findOne({ _id: new ObjectId(userID as string) });
        console.log(user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error al actualizar la base de datos:", error.message);
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al procesar notificación de pago:", error.message);
    }
    return new Response(null, { status: 500 });
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, { status: 200 });
};
