import { Payment } from "mercadopago";
import { mpClient } from "../mp/route";
import { IUser } from "@/types/user";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import Pago from "@/lib/models/pagos";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------
// Este script es para recibir las notificaciones de MercadoPago.
// ---------------------------------------------------------------------

async function generarComprobantePDF(payment: any, payerUser: any) {
  const doc = new PDFDocument();
  const fecha = new Date().toISOString().split('T')[0];
  const nombreArchivo = `comprobante-${payment.id}-${fecha}.pdf`;
  
  // Asegúrate de que el directorio existe
  const dir = path.join(process.cwd(), 'public', 'Pagos');
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const rutaArchivo = path.join(dir, nombreArchivo);
  const writeStream = fs.createWriteStream(rutaArchivo);

  doc.pipe(writeStream);
  
  // Diseño del PDF
  const logoPath = path.join(process.cwd(), 'public', 'mackyna_verde.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, {
      fit: [100, 100],
      align: 'center',
      valign: 'center'
    });
    doc.moveDown();
  }
  doc.fontSize(20).text('Comprobante de Pago', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
  doc.text(`Cliente: ${payerUser.nombre} ${payerUser.apellido}`);
  doc.text(`Email: ${payment.payer?.email}`);
  doc.text(`Monto: $${payment.transaction_amount}`);
  doc.text(`Método de pago: ${payment.payment_type_id}`);
  doc.text(`ID de pago: ${payment.id}`);
  doc.text(`Estado: ${payment.status}`);
  doc.text(`Descripción: ${payment.description}`);
  
  doc.end();

  return new Promise((resolve) => {
    writeStream.on('finish', () => {
      resolve('/Pagos/' + nombreArchivo);
    });
  });
}

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = await request.json();

  try {
    // Obtenemos el pago
    const payment = await new Payment(mpClient).get({ id: body.data.id });

    // ----------------------   Si se aprueba, agregamos el mensaje  ------------------------------------------
    if (payment.status === "approved") {
      // Obtenemos los datos
      console.log(payment);
      const { external_reference, transaction_amount } = payment;
      console.log(
        `Pago aprobado por ${external_reference} por un monto de ${transaction_amount}`
      );

      // Hay que actualizar la base de datos con el pago aprobado

      const userID = payment.metadata.id;
      const payerUser = await User.findOne({
        _id: new ObjectId(userID as string),
      });
      if (!payerUser) {
        console.error("Usuario no encontrado");
        return new Response(null, { status: 404 });
      }
      // Guardamos el pago en la base de datos
      const rutaPDF = await generarComprobantePDF(payment, payerUser);
      const nuevoPago = new Pago({
        userID: new ObjectId(userID as string),
        nombre: payerUser.nombre + " " + payerUser.apellido,
        email: payment.payer?.email || '',
        fecha: new Date(),
        monto: transaction_amount,
        metodo: payment.payment_type_id,
        estado: payment.status,
        comprobante: payment.id,
        descripcion: payment.description,
        rutaComprobante: rutaPDF, // Agregar esta línea
      });

      try {
        // Guardamos el pago
        await nuevoPago.save();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error al guardar el pago:", error.message);
        }
      }

      // Aquí se puede hacer una llamada a la base de datos para actualizar el pago
      try {
        const claseUser = payment.metadata.clase;
        let diasUser = 0;
        switch (claseUser) {
          case "Clase Individual":
            diasUser = 1;
            break;
          case "Semana":
            diasUser = 2;
            break;
          case "Qincena":
            diasUser = 4;
            break;
          case "3 Días":
            diasUser = 3;
            break;
          case "4 o 5 Días":
            diasUser = 5;
            break;
          case "Libre":
            diasUser = 10;
            break;
        }

        // Actualizamos el pago en el user
        await User.updateOne(
          { _id: new ObjectId(userID as string) },
          { $set: { 
            ultimo_pago: new Date() ,
            dias_permitidos: diasUser,
            habilitado: true,
            bloqueado: false,
          } }
        );
        const user: IUser | null = await User.findOne({ _id: new ObjectId(userID as string) });
        console.log(user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error al actualizar la base de datos:", error.message);
        }
      }
    } else if (payment.status === "rejected") {
      // Si el pago fue rechazado, podemos manejarlo aquí
      console.log(
        `Pago rechazado por ${payment.external_reference} por un monto de ${payment.transaction_amount}`
      );
    }
    else if (payment.status === "pending") {
      // Si el pago está pendiente, podemos manejarlo aquí
      console.log(
        `Pago pendiente por ${payment.external_reference} por un monto de ${payment.transaction_amount}`
      );
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
