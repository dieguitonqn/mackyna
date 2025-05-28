// import type { NextApiRequest } from "next";
// import { ReadStream } from "fs";

import fs from "fs";
import { getServerSession } from "next-auth/next"; // Si usas NextAuth.js para autenticación
import { authOptions } from "@/lib/auth0";
import logger from "@/lib/logger";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  // --- Implementa tu lógica de autenticación y autorización aquí ---
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    logger.warn("Intento de acceso no autorizado al endpoint GET /api/recibos");
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { searchParams } = new URL(req.url as string);
  const ruta = searchParams.get("ruta"); // Recibes la ruta guardada en la base de datos
  
  if (!ruta || typeof ruta !== "string") {
    return new NextResponse(
      JSON.stringify({ message: "Ruta de archivo inválida." }),
      { status: 400 }
    );
  }

  const filePath = ruta;
  logger.info(`Solicitando archivo: ${filePath}`);

  try {
    if (!fs.existsSync(filePath)) {
      logger.error(`Archivo no encontrado en la ruta: ${filePath}`);
      return new NextResponse(
        JSON.stringify({ message: "Archivo no encontrado." }),
        { status: 404 }
      );
    }

    const fileStream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    let contentType = "";
    const fileExtension = filePath.split(".").pop()?.toLowerCase();

    if (fileExtension === "pdf") {
      contentType = "application/pdf";
    } else if (fileExtension === "jpg" || fileExtension === "jpeg") {
      contentType = "image/jpeg";
    } else {
      logger.warn(`Tipo de archivo no soportado: ${fileExtension} para la ruta: ${filePath}`);
      return new NextResponse(
        JSON.stringify({ message: "Tipo de archivo no soportado." }),
        { status: 415 } // Unsupported Media Type
      );
    }

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": "inline", // 'inline' para mostrar en el navegador, 'attachment' para descargar
      "Content-Length": stat.size.toString(),
    });

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          fileStream.on('data', (chunk) => controller.enqueue(chunk));
          fileStream.on('end', () => controller.close());
          fileStream.on('error', (err) => {
            logger.error(`Error al leer el archivo ${filePath}: ${err.message}`);
            controller.error(err);
          });
        },
      }),
      { headers }
    );
  } catch (error: any) {
    logger.error(`Error al procesar la solicitud para ${filePath}: ${error.message}`, { error });
    return new NextResponse(
      JSON.stringify({ message: "Error interno del servidor." , error: error.message }),
      { status: 500 }
    );
  }
};