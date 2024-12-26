import Metric from "@/lib/models/metrics";
import { NextResponse } from "next/server"


export  const POST = async (req:Request)=>{
    try {
        const newMtric = await req.json();
        console.log(newMtric)
        const nuevaMedicion = await Metric.create(newMtric);
        if(!nuevaMedicion){
            return new NextResponse ("No se pudo ingresar la medidicón",{status:500})
        }
        return new NextResponse("Todo ok",{status:202})
    } catch (error:unknown) {
        return NextResponse.json({error: "error desconocido"+error},{status:500});
    }

}

export const PUT = async (req:Request)=>{
    try {
        const editedMetric = await req.json();
        console.log(editedMetric);
        editedMetric.date = new Date(editedMetric.date);
        console.log(editedMetric);
        return NextResponse.json({message:"Todo ok"},{status:202})
    } catch (error:unknown) {
        return NextResponse.json({error:"Ocurrio un error: "+error},{status:500})
    }
}