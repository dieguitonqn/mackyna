
import connect  from '@/lib/db';
import Config from '@/lib/models/config';
import { NextResponse } from 'next/server';

export const GET = async () => {
    // if (req.method !== 'GET') {
    //     return res.status(405).json({ success: false, error: 'Method not allowed' });
    // }

    try {
        await connect();
        
        const configs = await Config.findOne();
        
        if(!configs) {
            return new NextResponse("No se encontraron configuraciones", { status: 404 });
        }
        // console.log(configs);
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
        const { valorClase, valorSemana, valorQuincena, valorTresDias, valorCincoDias, valorLibre, valorDescuento } = await req.json();

        const configs = await Config.findOne({});

        if(!configs) {
            const newConfigs = new Config({
                valorClase,
                valorSemana,
                valorQuincena,
                valorTresDias,
                valorCincoDias,
                valorLibre,
                valorDescuento,
            });

            await newConfigs.save();
        } else {
            configs.valorClase = valorClase;
            configs.valorSemana = valorSemana;
            configs.valorQuincena = valorQuincena;
            configs.valorTresDias = valorTresDias;
            configs.valorCincoDias = valorCincoDias;
            configs.valorLibre = valorLibre;
            configs.valorDescuento = valorDescuento;

            await configs.save();
        }

        return new NextResponse("Configuraciones guardadas", { status: 200 });
    } catch (error) {
        console.error('Error saving configurations:', error);
        return new NextResponse("Error al guardar configuraciones", { status: 500 });
    }
}