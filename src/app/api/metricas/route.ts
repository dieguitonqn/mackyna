import Metric from "@/lib/models/metrics";
import { NextResponse } from "next/server";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth0";
import { getServerSession } from "next-auth";


export  const POST = async (req:Request)=>{
    const session = await getServerSession({ req, ...authOptions });
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    try {
        const newMetric = await req.json();
        // console.log(newMetric);
        // const userID = newMetric.userID;
        // console.log(userID);
        const nuevaMedicion = await Metric.create(newMetric);
        if(!nuevaMedicion){
            return new NextResponse ("No se pudo ingresar la medidicón",{status:500})
        }

        const ultima_metrica = await User.findByIdAndUpdate({ _id: new ObjectId(newMetric.userID as string) }, { ultima_metrica: Date.now() }, { new: true });
        if (!ultima_metrica) {
            return new NextResponse("No se pudo actualizar la fecha de la ultima planilla", { status: 400 });
        }   

        return new NextResponse("Todo ok",{status:202})
    } catch (error:unknown) {
        return NextResponse.json({error: "error desconocido"+error},{status:500});
    }

}

export const PUT = async (req:Request)=>{
    const session = await getServerSession({ req, ...authOptions });
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    try {
        const editedMetric0 = await req.json();
        console.log(editedMetric0);

        const partesFecha = editedMetric0.date.split('-');
        const dia = parseInt(partesFecha[0]);
        const mes = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(partesFecha[1]) + 1;
        const anio = parseInt(partesFecha[2]);
        
        // Creamos el objeto Date
        const fecha = new Date(anio, mes - 1, dia);
        const editedMetric = editedMetric0;
        editedMetric.date = new Date(fecha);

        const metricaEditada = await Metric.findOneAndUpdate(
            {createdAt:editedMetric.createdAt},
            {$set:editedMetric},
            {new:true});

        console.log(metricaEditada);
        return NextResponse.json({message:"Todo ok"},{status:202})
    } catch (error:unknown) {
        console.log(error);
        return NextResponse.json({error:"Ocurrio un error: "+error},{status:500})
    }
}