import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';
import Pago from "@/lib/models/pagos";
import fs from 'fs';

// Función para validar strings
function isValidString(value: any, maxLength: number): value is string {
    return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

// Función para validar números
function isValidNumber(value: any): boolean {
    return typeof value === 'string' && !isNaN(Number(value));
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        console.log("formData", formData);

        // Validar y sanear userID
        let userID = formData.get('userID');
        if (!isValidString(userID, 255)) {
            return NextResponse.json({ message: "Invalid userID" }, { status: 400 });
        }

        // Validar y sanear fecha
        let fecha = formData.get('fecha');
        if (!isValidString(fecha, 255)) {
            return NextResponse.json({ message: "Invalid fecha" }, { status: 400 });
        }

        // Validar y sanear monto
        let monto = formData.get('monto');
        if (!isValidNumber(monto)) {
            return NextResponse.json({ message: "Invalid monto" }, { status: 400 });
        }
        const montoNumber = monto ? Number(monto) : 0;

        // Validar y sanear metodo
        let metodo = formData.get('metodo');
        if (!isValidString(metodo, 255)) {
            return NextResponse.json({ message: "Invalid metodo" }, { status: 400 });
        }

        // Validar y sanear estado
        let estado = formData.get('estado');
        if (!isValidString(estado, 255)) {
            return NextResponse.json({ message: "Invalid estado" }, { status: 400 });
        }

        // Validar y sanear descripcion
        let descripcion = formData.get('descripcion');
        if (!isValidString(descripcion, 1000)) {
            return NextResponse.json({ message: "Invalid descripcion" }, { status: 400 });
        }

        const file = formData.get('comprobante') as File | null;

        if (!userID || !fecha || !monto || !metodo || !estado || !descripcion) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        let filePath = null;
        if (file) {
            // Validar tipo de archivo
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!file.type || !allowedMimeTypes.includes(file.type)) {
                return NextResponse.json({ message: "Invalid file type" }, { status: 400 });
            }

            // Validar tamaño del archivo (ejemplo: máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return NextResponse.json({ message: "File size too large" }, { status: 400 });
            }

            const buffer = await file.arrayBuffer();
            const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanear el nombre del archivo
            const pagosDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'); // Usar variable de entorno
            if (!fs.existsSync(pagosDir)) {
                fs.mkdirSync(pagosDir, { recursive: true });
            }
            filePath = path.join(pagosDir, filename);
            await writeFile(filePath, Buffer.from(buffer));
            filePath = `${process.env.UPLOAD_DIR || 'uploads'}/${filename}`; // Usar variable de entorno
        }

        // Here you would typically save the data to your database
        // For example:
        try{
            const newPago = await Pago.create({
            userID,
            fecha,
            monto: montoNumber,
            metodo,
            estado,
            comprobante: filePath,
            descripcion
        });
        }catch(error:unknown){
            if (error instanceof Error){
                console.log("Error al guardar el pago: " + error.message);
                return  NextResponse.json({ message: "Error al guardar el pago" }, { status: 500 });
            }else{
                console.log("Error desconocido");
                return  NextResponse.json({ message: "Error desconocido" }, { status: 500 });
            }
        }
        

        console.log({
            userID,
            fecha,
            monto,
            metodo,
            estado,
            comprobante: filePath,
            descripcion
        });

        return NextResponse.json({ message: "Pago creado exitosamente", filePath }, { status: 201 });

    } catch (error: unknown) {
        console.error("Error creating pago:", error);
        return NextResponse.json({ message: "Error creating pago" }, { status: 500 });
    }
}
