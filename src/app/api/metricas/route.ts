import Metric from "@/lib/models/metrics";
import { NextResponse } from "next/server"


export  const POST= async (req:Request)=>{
    try {
        const newMtric = await req.json();
        console.log(newMtric)
        const nuevaMedicion = await Metric.create(newMtric);
        if(!nuevaMedicion){
            return new NextResponse ("No se pudo ingresar la medidicón",{status:500})
        }
        return new NextResponse("Todo ok",{status:202})
    } catch (error:unknown) {
        return NextResponse.json({error: "error desconocido"},{status:500});
    }

}