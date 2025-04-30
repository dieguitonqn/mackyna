import type { NextApiRequest } from "next";
// import { ReadStream } from "fs";

import fs from "fs";
import { getServerSession } from "next-auth/next"; // Si usas NextAuth.js para autenticación
import { authOptions } from "@/lib/auth0";
import logger from "@/lib/logger";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest) => {
  // --- Implementa tu lógica de autenticación y autorización aquí ---
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    logger.warn("Intento de acceso no autorizado al endpoint GET /api/recibos");
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { searchParams } = new URL(req.url as string);
  const ruta = searchParams.get("ruta"); // Recibes la ruta guardada en la base de datos
  console.log(ruta);
  
  if (!ruta || typeof ruta !== "string") {
    return new NextResponse(
      JSON.stringify({ message: "Ruta de archivo inválida." }),
      { status: 400 }
    );
  }

  const filePath = ruta
  // path.join(process.cwd(), ruta); // Usa la ruta directamente desde la base de datos
  console.log(filePath);
  try {
    const fileStream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Content-Length": stat.size.toString(),
    });

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          fileStream.on('data', (chunk) => controller.enqueue(chunk));
          fileStream.on('end', () => controller.close());
          fileStream.on('error', (err) => controller.error(err));
        },
      }),
      { headers }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Archivo no encontrado." , error }),
      { status: 404 }
    );
  }
};