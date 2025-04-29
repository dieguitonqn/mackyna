import { NextRequest, NextResponse } from "next/server";
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

        let nombre = formData.get('nombre');
        if (!isValidString(nombre, 255)) {
            return NextResponse.json({ message: "Invalid nombre" }, { status: 400 });
        }

        let email = formData.get('email');
        if (!isValidString(email, 255)) {
            return NextResponse.json({ message: "Invalid email" }, { status: 400 });
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
            const meses = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
              ];
            const mesActual = meses[new Date().getMonth()];
            
              // Asegúrate de que el directorio existe        
            
            const pagosDir = path.join(process.cwd(),  "uploads", "Pagos", mesActual); // Usar variable de entorno
            if (!fs.existsSync(pagosDir)) {
                fs.mkdirSync(pagosDir, { recursive: true });
            }
            // Guardar el archivo en el servidor
            filePath = path.join(pagosDir, filename);
            await writeFile(filePath, Buffer.from(buffer));
            // filePath = `/uploads/${filename}`; // Ruta relativa para acceso desde el cliente
            // await writeFile(path.join(process.cwd(), 'public','uploads', filename), Buffer.from(buffer));
        }

        // Here you would typically save the data to your database
        // For example:
        try{
            const newPago = await Pago.create({
            userID,
            nombre,
            email,
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
            nombre,
            email,
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


export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
    }
    console.log(id);
    try {
        const pagos = await Pago.find({ userID: id }).lean();
        console.log(pagos);
        // Transformar _id a string
        const pagosConIdString = pagos.map((pago) => ({
            ...pago,
            _id: pago._id!.toString(),
            userID: pago.userID,
            nombre: pago.nombre,
            email: pago.email,
            fecha: pago.fecha,
            monto: pago.monto,
            metodo: pago.metodo,
            estado: pago.estado,
            comprobante: pago.comprobante,
            descripcion: pago.descripcion
        }));
        return NextResponse.json(pagosConIdString);
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json({ message: "Error al obtener los pagos" }, { status: 500 });
    }
}
