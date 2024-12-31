'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Medicion } from "@/types/metrics"


const Chart = ({ data }: { data: Medicion[] }) => {

    return (
            <div className="w-full md:w-1/2 bg-slate-100">

                <ResponsiveContainer width={'100%'} aspect={2}>
                    <LineChart
                        width={500}
                        height={500}
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 10,
                            bottom: 5,
                            
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="weigth" name="Peso" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="IMC" name="IMC" stroke="#3838c4" />
                        <Line type="monotoneX" dataKey="body_fat" name="%Grasa Corporal" stroke="#f13d17" />
                        <Line type="monotoneX" dataKey="body_musc" name="%Músculo Corporal" stroke="#60c438" />
                        <Line type="monotoneX" dataKey="visceral_fat" name="%Grasa visceral" stroke="#a932ab" />
                    </LineChart>
                </ResponsiveContainer>


            </div>
    )
}

export default Chart;