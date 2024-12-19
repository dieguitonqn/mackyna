// import Chart from "@/components/PortalAlumnos/charts";
// import connect from "@/lib/db";
// import Medicion from "@/lib/models/metrics";

// interface MedicionLocal {
//     userID: string;
//     date: string; // Actualizamos el tipo a string porque contendrá la fecha formateada
//     weigth: number;
//     IMC: number;
//     body_fat: number;
//     body_musc: number;
//     visceral_fat: number;
//     body_age: number;
//     createdAt: Date;
// }

async function page() {
    // await connect();
    // const rawMetricsData = await Medicion.find({ userID: "user123" }).lean();

    // // Transformar los datos para extraer día, mes y año
    // const metricsData: MedicionLocal[] = rawMetricsData.map(({ _id, createdAt, updatedAt, date, ...rest }: any) => {
    //     const parsedDate = new Date(date);


    //     // Extraer día, mes y año
    //     const day = parsedDate.getDate();
    //     const month = parsedDate.toLocaleString('default', { month: 'short' }); // "Jan", "Feb", etc.
    //     const year = parsedDate.getFullYear();

    //     // Formatear como "dd-MMM-yyyy", ej: "15-Jan-2024"
    //     const formattedDate = `${day}-${month}-${year}`;

    //     return { ...rest, date: formattedDate }; // Reemplazo date con la fecha formateada
    // });

    // console.log(metricsData);

    return (
        <div className='h-screen '>
            <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                Métricas de usuario
            </div>
        
            {/* <Chart data={metricsData} /> */}
        </div>
    );
}

export default page;