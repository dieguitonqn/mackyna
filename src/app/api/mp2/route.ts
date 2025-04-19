import { Payment } from "mercadopago";
import { mpClient } from "../mp/route";
import { IUser } from "@/types/user";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import Pago from "@/lib/models/pagos";
import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------
// Este script es para recibir las notificaciones de MercadoPago.
// ---------------------------------------------------------------------

async function generarComprobantePDF(payment: any, payerUser: any) {
  console.log("Generando comprobante PDF...");
  const doc = new jsPDF();
  const fecha = new Date().toISOString().split("T")[0];
  const nombreArchivo = `comprobante-${payment.id}-${fecha}.pdf`;
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const mesActual = meses[new Date().getMonth()];

  // Asegúrate de que el directorio existe
  const dir = path.join(process.cwd(), "uploads", "Pagos", mesActual);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const rutaArchivo = path.join(dir, nombreArchivo);

  // Diseño del PDF
  const logoPath = path.join(process.cwd(), "public", "mackyna_verde.png");
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath).toString("base64");
    doc.addImage(logoData, "PNG", 80, 10, 80, 50); // Ajusta las coordenadas y tamaño según sea necesario
  }

  doc.setFontSize(20);
  doc.text("Comprobante de Pago", 105, 70, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 90);
  doc.text(`Cliente: ${payerUser.nombre} ${payerUser.apellido}`, 10, 100);
  doc.text(`Email: ${payment.payer?.email}`, 10, 110);
  doc.text(`Monto: $${payment.transaction_amount}`, 10, 120);
  doc.text(`Método de pago: ${payment.payment_type_id === "debit_card"?"Tarjeta de debito":"Saldo en cuenta"} `, 10, 130);
  doc.text(`ID de pago: ${payment.id}`, 10, 140);
  doc.text(`Estado: ${payment.status === "approved" ? "Aprobado" : payment.status === "rejected" ? "Rechazado" : payment.status === "pending" ? "Pendiente" : payment.status}`, 10, 150);
  doc.text(`Descripción: ${payment.description}`, 10, 160);

  // Guardar el PDF en el servidor
  return new Promise((resolve, reject) => {
    try {
      const pdfBuffer = doc.output("arraybuffer");
      fs.writeFileSync(rutaArchivo, Buffer.from(pdfBuffer));
      resolve(dir+"/" + nombreArchivo);
    } catch (err) {
      reject(err);
    }
  });
}

export async function POST(request: Request) {
  const body: { data: { id: string } } = await request.json();

  try {
    const payment = await new Payment(mpClient).get({ id: body.data.id });

    if (payment.status === "approved") {
      const userID = payment.metadata.id;
      const payerUser = await User.findOne({ _id: new ObjectId(userID as string) });
      if (!payerUser) {
        console.error("Usuario no encontrado");
        return new Response(null, { status: 404 });
      }

      const rutaPDF = await generarComprobantePDF(payment, payerUser);
      const nuevoPago = new Pago({
        userID: new ObjectId(userID as string),
        nombre: `${payerUser.nombre} ${payerUser.apellido}`,
        email: payment.payer?.email || '',
        fecha: new Date(),
        monto: payment.transaction_amount,
        metodo: payment.payment_type_id === 'debit_card'?"Tarjeta de Débito" : payment.payment_type_id === 'credit_card' ? "Tarjeta de Crédito" : payment.payment_type_id==='account_money'?"Dinero Disponible" : payment.payment_type_id,
        estado: payment.status === "approved" ? "Aprobado" : payment.status === "rejected" ? "Rechazado" : payment.status === "pending" ? "Pendiente" : payment.status,
        comprobante: rutaPDF,
        descripcion: payment.description,
        // rutaComprobante: rutaPDF,
      });

      await nuevoPago.save();

      const claseUser = payment.metadata.clase;
      let diasUser = 0;
      switch (claseUser) {
        case "Clase Individual": diasUser = 1; break;
        case "Semana": diasUser = 2; break;
        case "Qincena": diasUser = 4; break;
        case "3 Días": diasUser = 3; break;
        case "4 o 5 Días": diasUser = 5; break;
        case "Libre": diasUser = 10; break;
      }

      await User.updateOne(
        { _id: new ObjectId(userID as string) },
        {
          $set: {
            ultimo_pago: new Date(),
            dias_permitidos: diasUser,
            habilitado: true,
            bloqueado: false,
          }
        }
      );
    } else if (payment.status === "rejected") {
      console.log(`Pago rechazado por ${payment.external_reference} por un monto de ${payment.transaction_amount}`);
    } else if (payment.status === "pending") {
      console.log(`Pago pendiente por ${payment.external_reference} por un monto de ${payment.transaction_amount}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al procesar notificación de pago:", error.message);
    }
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
};
