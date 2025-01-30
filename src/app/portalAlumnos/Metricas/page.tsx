// import Chart from "@/components/PortalAlumnos/charts";
// import connect from "@/lib/db";
// import Medicion from "@/lib/models/metrics";
import { authOptions } from "@/lib/auth0";
import Chart from "@/components/PortalAlumnos/Metricas/charts";
import NewMetric from "@/components/PortalAlumnos/Metricas/newMetric";
import { IUser } from "@/types/user"

import connect from "@/lib/db";
import Metric from "@/lib/models/metrics";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import MetriscsTable from "@/components/PortalAlumnos/Metricas/metricsTable";
import { Suspense } from "react";
import { MetricCard } from "@/components/PortalAlumnos/Metricas/metricCard";


interface MedicionLocal {
    _id: string;
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

    function formatDate(date: string): string {
        const parsedDate = new Date(date);
        const day = parsedDate.getDate();
        const month = parsedDate.toLocaleString('es-ES', { month: 'short' });
        const year = parsedDate.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function processMetricsData(rawMetricsData: MedicionLocal[]): MedicionLocal[] {
        return rawMetricsData.map(({ _id,date, ...rest }) => ({
            ...rest,
            date: formatDate(date),
            _id: _id.toString(),
        }));
    }


    const sessionUserID = session?.user.id.toString();
    const urlUserId = (await searchParams).id as string

    if (!sessionUserID && !urlUserId) {
        // No valid user ID found, potentially handle this case differently
        return (
            <div className="flex justify-center items-center text-4xl text-white h-screen">
                <h1>No se encontró un ID de usuario válido</h1>
            </div>
        );
    }

    try {
        await connect();
        if (sessionUserID != '' && !urlUserId) {
            const rawMetricsData = await Metric.find({ userID: sessionUserID }).sort({ date: 1 }).lean<MedicionLocal[]>();
            const user = await User.findOne({ _id: new ObjectId(sessionUserID) }).lean<IUser>();

            if (!rawMetricsData || rawMetricsData.length === 0) {
                return (
                    <div className="flex justify-center items-center text-4xl text-white h-screen">
                        <h1 className="">
                            No se encontraron métricas del usuario de la sesión
                        </h1>
                        {(session.user.rol === "teach" || session.user.rol === 'admin') && (
                            <div>
                                <NewMetric userID={urlUserId} userName={session.user.name} />
                            </div>
                        )}
                    </div>
                );
            } else {

                const metricsData = processMetricsData(rawMetricsData);

                // console.log(metricsData);
                return (
                    <div className='md:h-screen  h-full  justify-center mx-auto '>
                        <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                            Métricas de {session.user.name}
                        </div>

                        <div className="flex flex-wrap gap-10 justify-center items-center">
                            <MetricCard userID={user!._id.toString()} birthDate={user?.fecha_nacimiento} altura={user?.altura} objetivo={user?.objetivo}/>
                            <Chart data={metricsData} />
                        </div>

                        {(session.user.rol === "teach" || session.user.rol === 'admin') && (
                            <div className="my-5">
                                <NewMetric userID={urlUserId} userName={session.user.name} />
                            </div>
                        )}

                        <Suspense fallback={<div className="text-8xl text-white">Loading...</div>}>

                            <MetriscsTable data={metricsData} />
                        </Suspense>



                    </div >

                );
            }
        } else if (urlUserId != '') {
            const userInfo: IUser | null = await User.findOne({ _id: new ObjectId(urlUserId) }).lean<IUser>();
            // console.log(userInfo);
            const rawMetricsData = await Metric.find({ userID: urlUserId }).sort({ date: 1 }).lean<MedicionLocal[]>();
            // console.log(rawMetricsData)
            if (rawMetricsData === null || rawMetricsData.length === 0) {
                // console.log('bandera')
                return (
                    <div className=" container h-screen">

                        {(session.user.rol === "teach" || session.user.rol === 'admin') && (
                            <div>
                                <NewMetric userID={urlUserId} userName={userInfo!.nombre} />
                            </div>
                        )}

                        <h1 className="flex justify-center items-center text-white text-4xl">
                            No se encontraron métricas del usuario
                        </h1>
                    </div>
                );
            } else {
                // console.log('bandera2')

                const metricsData = processMetricsData(rawMetricsData);
                // console.log(metricsData);
                return (
                    <div className='h-full  justify-center gap-10'>
                        <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                            Métricas de {userInfo!.nombre}
                        </div>


                        <div className="flex flow-wrap justify-center items-center my-10">
                            <MetricCard userID={userInfo!._id.toString()} />
                            <Suspense fallback={<div className="text-8xl text-white">Loading...</div>}>
                                <Chart data={metricsData} />
                            </Suspense>
                        </div>
                        {(session.user.rol === "teach" || session.user.rol === 'admin') && (
                            <div className="my-5">
                                <NewMetric userID={urlUserId} userName={userInfo!.nombre} />
                            </div>
                        )}

                        <MetriscsTable data={metricsData} />

                    </div>

                );
            }
        }

    } catch (error: unknown) {
        console.error(error)
    }

}

export default page;