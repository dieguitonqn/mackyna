// import Chart from "@/components/PortalAlumnos/charts";
// import connect from "@/lib/db";
// import Medicion from "@/lib/models/metrics";
import { authOptions } from "@/lib/auth0";
import Chart from "@/components/PortalAlumnos/charts";
import NewMetric from "@/components/PortalAlumnos/newMetric";
import { IUser } from "@/types/user"

import connect from "@/lib/db";
import Metric from "@/lib/models/metrics";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";


interface MedicionLocal {
    userID: string;
    date: string; // Actualizamos el tipo a string porque contendrá la fecha formateada
    weigth: number;
    IMC: number;
    body_fat: number;
    body_musc: number;
    visceral_fat: number;
    body_age: number;
    createdAt: Date;
}

async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    const sessionUserID = session?.user.id.toString();
    const urlUserId = (await searchParams).id as string
    try {
        await connect();
        if (sessionUserID != '' && !urlUserId) {
            const rawMetricsData = await Metric.find({ userID: sessionUserID }).lean<MedicionLocal[]>();
            if (!rawMetricsData || rawMetricsData.length === 0) {
                return (
                    <div className="flex justify-center items-center text-4xl text-white h-screen">
                        <h1 className="">
                            No se encontraron métricas del usuario de la sesión
                        </h1>
                        <div>
                            <NewMetric userID={sessionUserID} userName={session.user.name} />
                        </div>
                    </div>
                );
            } else {
                const metricsData: MedicionLocal[] = rawMetricsData.map(({date, ...rest }: MedicionLocal) => {
                    const parsedDate = new Date(date);


                    // Extraer día, mes y año
                    const day = parsedDate.getDate();
                    const month = parsedDate.toLocaleString('default', { month: 'short' }); // "Jan", "Feb", etc.
                    const year = parsedDate.getFullYear();

                    // Formatear como "dd-MMM-yyyy", ej: "15-Jan-2024"
                    const formattedDate = `${day}-${month}-${year}`;

                    return { ...rest, date: formattedDate, _id: undefined}; // Reemplazo date con la fecha formateada
                });

                console.log(metricsData);
                return (
                    <div className='h-screen  justify-center '>
                        <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                            Métricas de usuario
                        </div>
                        <div>
                            <NewMetric userID={sessionUserID} userName={session.user.name} />
                        </div>
                        <div className="flex justify-center items-center">
                            <Chart data={metricsData} />
                        </div>

                    </div>

                );
            }
        } else if (urlUserId != '') {
            const userInfo: IUser | null = await User.findOne({ _id: new ObjectId(urlUserId) }).lean<IUser>();
            console.log(userInfo);
            const rawMetricsData = await Metric.find({ userID: urlUserId }).lean<MedicionLocal[]>();
            console.log(rawMetricsData)
            if (rawMetricsData === null || rawMetricsData.length === 0) {
                console.log('bandera')
                return (
                    <div className=" container h-screen">
                        <div className="flex justify-end mt-10">
                            <NewMetric userID={urlUserId} userName={userInfo!.nombre} />
                        </div>
                        <h1 className="flex justify-center items-center text-white text-4xl">
                            No se encontraron métricas del usuario
                        </h1>
                    </div>
                );
            } else {
                console.log('bandera2')
                const metricsData: MedicionLocal[] = rawMetricsData.map(({ date, ...rest }: MedicionLocal) => {
                    const parsedDate = new Date(date);
                    console.log(parsedDate);

                    // Extraer día, mes y año
                    const day = parsedDate.getDate();
                    const month = parsedDate.toLocaleString('default', { month: 'short' }); // "Jan", "Feb", etc.
                    const year = parsedDate.getFullYear();

                    // Formatear como "dd-MMM-yyyy", ej: "15-Jan-2024"
                    const formattedDate = `${day}-${month}-${year}`;

                    return { ...rest, date: formattedDate , _id:undefined}; // Reemplazo date con la fecha formateada
                });

                console.log(metricsData);
                return (
                    <div className='h-screen  justify-center '>
                        <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                            Métricas de usuario
                        </div>
                        {(session.user.rol === "teach" || session.user.rol === 'admin') && (
                            <div>
                                <NewMetric userID={urlUserId} userName={userInfo!.nombre} />
                            </div>
                        )}

                        <div className="flex justify-center items-center">
                            <Chart data={metricsData} />
                        </div>

                    </div>

                );
            }
        }

    } catch (error: unknown) {
console.error(error)
    }

}

export default page;