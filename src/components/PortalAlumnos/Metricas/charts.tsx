'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Medicion } from "@/types/metrics"
import { formatDateOnlyEs } from "@/utils/dateOnly"


const Chart = ({ data }: { data: Medicion[] }) => {

    return (
            <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111713] p-4 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.9)] sm:p-5">
                <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8e994]">Progreso</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">Evolución de las mediciones</h2>
                </div>
                <ResponsiveContainer width="100%" aspect={1.75}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 16,
                            right: 12,
                            left: -12,
                            bottom: 4,
                        }}
                    >
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value: string) => formatDateOnlyEs(value, { day: '2-digit', month: 'short' })} tick={{ fill: "#94a3a0", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                        <YAxis tick={{ fill: "#94a3a0", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0b0e0c", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#f8fafc" }} labelStyle={{ color: "#c8e994" }} />
                        <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12, paddingTop: 8 }} />
                        <Line type="monotone" dataKey="weigth" name="Peso" stroke="#b9dc75" strokeWidth={2.5} dot={{ r: 2, fill: "#b9dc75" }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="IMC" name="IMC" stroke="#78b7a1" strokeWidth={2} dot={false} />
                        <Line type="monotoneX" dataKey="body_fat" name="% Grasa corporal" stroke="#e39b72" strokeWidth={2} dot={false} />
                        <Line type="monotoneX" dataKey="body_musc" name="% Músculo corporal" stroke="#8c9ee8" strokeWidth={2} dot={false} />
                        <Line type="monotoneX" dataKey="visceral_fat" name="% Grasa visceral" stroke="#c28ac7" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </section>
    )
}

export default Chart;
