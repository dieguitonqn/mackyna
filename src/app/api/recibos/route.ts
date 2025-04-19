import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
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
      "Content-Type": "application/pdf", // Ajusta el Content-Type
      "Content-Disposition": "inline", // O 'attachment' para forzar la descarga
      "Content-Length": stat.size.toString(),
    });

    return new NextResponse(fileStream as any, { headers });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Archivo no encontrado." }),
      { status: 404 }
    );
  }
};
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { ruta } = req.query; // Recibes la ruta guardada en la base de datos

//   // --- Implementa tu lógica de autenticación y autorización aquí ---
//   const session = await getServerSession({ req, res });
//   if (!session) {
//     return res.status(401).json({ message: 'No autorizado.' });
//   }

//   if (!ruta || typeof ruta !== 'string') {
//     return res.status(400).json({ message: 'Ruta de archivo inválida.' });
//   }

//   const filePath = path.join(process.cwd(), ruta); // Usa la ruta directamente desde la base de datos

//   try {
//     const fileStream = fs.createReadStream(filePath);
//     const stat = fs.statSync(filePath);

//     res.setHeader('Content-Type', 'application/pdf'); // Ajusta el Content-Type
//     res.setHeader('Content-Disposition', 'inline'); // O 'attachment' para forzar la descarga
//     res.setHeader('Content-Length', stat.size);

//     fileStream.pipe(res);
//   } catch (error) {
//     return res.status(404).json({ message: 'Archivo no encontrado.' });
//   }
// }
