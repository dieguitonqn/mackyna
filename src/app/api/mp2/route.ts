import {Payment} from "mercadopago";
import { mpClient } from "../mp/route";


export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: {data: {id: string}} = await request.json();

  // Obtenemos el pago
  const payment = await new Payment(mpClient).get({id: body.data.id});

  // Si se aprueba, agregamos el mensaje
  if (payment.status === "approved") {
    // Obtenemos los datos
    console.log(payment);
    const {external_reference, transaction_amount} = payment;
    console.log(`Pago aprobado por ${external_reference} por un monto de ${transaction_amount}`);
    

    // Revalidamos la página de inicio para mostrar los datos actualizados
    
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, {status: 200});
}