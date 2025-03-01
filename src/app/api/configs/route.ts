
import connect  from '@/lib/db';
import Config from '@/lib/models/config';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
    // if (req.method !== 'GET') {
    //     return res.status(405).json({ success: false, error: 'Method not allowed' });
    // }

    try {
        await connect();
        
        const configs = await Config.findOne();
        
        if(!configs) {
            return new NextResponse("No se encontraron configuraciones", { status: 404 });
        }
        console.log(configs);
        return new NextResponse(JSON.stringify(configs), { status: 200 });
    } catch (error) {
        console.error('Error fetching configurations:', error);
        return new NextResponse("Error al obtener configuraciones", { status: 500 });
    }
}


export const POST = async (req: Request) => {
    // if (req.method !== 'POST') {
    //     return res.status(405).json({ success: false, error: 'Method not allowed' });
    // }

    try {
        await connect();
        
        // const body = ;
        const { valorClase, valorDia, valor4dias, valor5dias, valorLibre } = await req.json();

        const configs = await Config.findOne();

        if(!configs) {
            const newConfigs = new Config({
                valorClase,
                valorDia,
                valor4dias,
                valor5dias,
                valorLibre
            });

            await newConfigs.save();
        } else {
            configs.valorClase = valorClase;
            configs.valorDia = valorDia;
            configs.valor4dias = valor4dias;
            configs.valor5dias = valor5dias;
            configs.valorLibre = valorLibre;

            await configs.save();
        }

        return new NextResponse("Configuraciones guardadas", { status: 200 });
    } catch (error) {
        console.error('Error saving configurations:', error);
        return new NextResponse("Error al guardar configuraciones", { status: 500 });
    }
}