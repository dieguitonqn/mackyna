'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  FiActivity, FiAlertCircle, FiArrowDownRight, FiArrowUpRight, FiClock,
  FiDatabase, FiRefreshCw, FiServer, FiUsers,
} from 'react-icons/fi';

type EventItem = {
  id: string; type: string; actor: string; targetId: string | null; action: string | null;
  message: string | null; route: string | null; status: number | null; createdAt: string;
};
type DashboardData = {
  generatedAt: string; rangeDays: number;
  users: { total: number; enabled: number; blocked: number; active: number };
  newUsers: { date: string; count: number }[];
  logins: { date: string; count: number; activeUsers: number }[];
  hourlyLogins: { hour: number; count: number }[]; totalLogins: number;
  database: { connected: boolean; latencyMs: number };
  process: { cpuPercent: number | null; memory: NodeJS.MemoryUsage; uptimeSeconds: number; nodeVersion: string };
  events: EventItem[]; infrastructureCollectorConfigured: boolean;
};

const periods = [
  { label: '7 días', value: 7 }, { label: '30 días', value: 30 },
  { label: '90 días', value: 90 }, { label: '12 meses', value: 365 },
];
const panel = 'rounded-2xl border border-white/[0.07] bg-[#151b20] shadow-[0_18px_50px_-35px_rgba(0,0,0,.8)]';
const tickStyle = { fill: '#84939a', fontSize: 11 };

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
}
function formatDuration(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return days ? `${days}d ${hours}h` : hours ? `${hours}h ${mins}m` : `${mins}m`;
}
function eventLabel(type: string) {
  const labels: Record<string, string> = {
    login: 'Inicio de sesión', login_failed: 'Acceso rechazado', logout: 'Cierre de sesión',
    admin_action: 'Acción administrativa', app_error: 'Error de aplicación', app_warning: 'Advertencia',
  };
  return labels[type] ?? type;
}
function localDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

export default function DashboardOverview() {
  const [view, setView] = useState('overview');
  const [days, setDays] = useState(30);
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('day');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/dashboard?days=${days}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(response.status === 403 ? 'Esta vista está disponible solo para administradores.' : 'No se pudo consultar el estado del dashboard.');
      setData(await response.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error de conexión');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, [days]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const readView = () => {
      const hash = window.location.hash.replace('#', '');
      setView(hash === 'uso' ? 'usage' : hash === 'operacion' ? 'operations' : hash === 'auditoria' ? 'audit' : 'overview');
    };
    readView();
    window.addEventListener('hashchange', readView);
    return () => window.removeEventListener('hashchange', readView);
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => { void load(true); }, 30_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const chartData = useMemo(() => {
    const byDate = new Map<string, { date: string; users: number; logins: number }>();
    for (const item of data?.newUsers ?? []) byDate.set(item.date, { date: item.date, users: item.count, logins: 0 });
    for (const item of data?.logins ?? []) {
      const row = byDate.get(item.date) ?? { date: item.date, users: 0, logins: 0 };
      row.logins = item.count; byDate.set(item.date, row);
    }
    const from = new Date();
    from.setDate(from.getDate() - (data?.rangeDays ?? 30) + 1);
    const daily: { date: string; users: number; logins: number }[] = [];
    for (let index = 0; index < (data?.rangeDays ?? 30); index += 1) {
      const date = new Date(from);
      date.setDate(from.getDate() + index);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      daily.push(byDate.get(key) ?? { date: key, users: 0, logins: 0 });
    }
    if (granularity === 'day') return daily.map((row) => ({ ...row, label: localDate(row.date) }));
    const grouped = new Map<string, { date: string; users: number; logins: number }>();
    for (const row of daily) {
      const date = new Date(`${row.date}T12:00:00`);
      if (granularity === 'week') date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      const key = granularity === 'month' ? row.date.slice(0, 7) : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const groupedRow = grouped.get(key) ?? { date: key, users: 0, logins: 0 };
      groupedRow.users += row.users; groupedRow.logins += row.logins; grouped.set(key, groupedRow);
    }
    return [...grouped.entries()].map(([key, row]) => ({ ...row, label: granularity === 'month' ? new Date(`${key}-15T12:00:00`).toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }) : `Sem ${localDate(key)}` }));
  }, [data, granularity]);

  const visibleEvents = useMemo(() => (data?.events ?? []).filter((event) => {
    if (eventFilter === 'errors') return event.type === 'app_error' || event.type === 'app_warning';
    if (eventFilter === 'access') return ['login', 'login_failed', 'logout'].includes(event.type);
    if (eventFilter === 'audit') return event.type === 'admin_action';
    return true;
  }), [data, eventFilter]);

  const title = view === 'usage' ? 'Uso y actividad' : view === 'operations' ? 'Operación' : view === 'audit' ? 'Actividad reciente' : 'Centro de control';
  const subtitle = view === 'usage' ? 'Crecimiento, sesiones y horarios de acceso.' : view === 'operations' ? 'Rendimiento actual del proceso y dependencias.' : view === 'audit' ? 'Accesos, cambios administrativos y eventos de la aplicación.' : 'Una lectura rápida del estado del servicio y de las cuentas.';

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-10 text-slate-100">
      <header className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9ebd67]">
            <span className="h-2 w-2 rounded-full bg-[#b7db70] shadow-[0_0_12px_#b7db70]" /> Mackyna · Administración
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-[34px]">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {view !== 'operations' && periods.map((period) => (
            <button key={period.value} onClick={() => setDays(period.value)} className={`rounded-lg px-3 py-2 text-xs font-medium transition ${days === period.value ? 'bg-[#a6c961] text-[#192018]' : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white'}`}>
              {period.label}
            </button>
          ))}
          <button onClick={() => void load(true)} aria-label="Actualizar" className="ml-1 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-slate-300 hover:bg-white/[0.08]">
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={15} />
          </button>
        </div>
      </header>

      {error && <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.08] p-4 text-sm text-rose-200"><FiAlertCircle />{error}</div>}
      {loading && !data ? <div className={`${panel} flex min-h-64 items-center justify-center text-sm text-slate-400`}><FiRefreshCw className="mr-2 animate-spin" /> Cargando métricas…</div> : data && <>
        {(view === 'overview' || view === 'usage') && <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Usuarios registrados" value={data.users.total.toLocaleString('es-AR')} note={`${data.users.enabled} habilitados`} icon={<FiUsers />} tone="lime" />
            <StatCard title="Altas del período" value={data.newUsers.reduce((sum, item) => sum + item.count, 0).toLocaleString('es-AR')} note={`${days === 365 ? 'Últimos 12 meses' : `Últimos ${days} días`}`} icon={<FiArrowUpRight />} tone="cyan" />
            <StatCard title="Usuarios con acceso" value={data.users.active.toLocaleString('es-AR')} note={`${data.totalLogins.toLocaleString('es-AR')} inicios de sesión`} icon={<FiActivity />} tone="violet" />
            <StatCard title="Cuentas bloqueadas" value={data.users.blocked.toLocaleString('es-AR')} note="Requieren revisión si no son esperadas" icon={<FiArrowDownRight />} tone={data.users.blocked ? 'rose' : 'slate'} />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
            <div className={`${panel} p-5 md:p-6`}>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="font-semibold text-white">Crecimiento y accesos</h2><p className="mt-1 text-xs text-slate-500">Nuevas cuentas e inicios de sesión por día</p></div>
                  <div className="flex flex-wrap items-center gap-4"><div className="flex gap-3 text-xs text-slate-400"><Legend color="#b8df73" label="Altas" /><Legend color="#52c9c3" label="Accesos" /></div><div className="flex rounded-lg border border-white/[0.08] p-0.5">{([['day', 'Día'], ['week', 'Semana'], ['month', 'Mes']] as const).map(([key, label]) => <button key={key} onClick={() => setGranularity(key)} className={`rounded-md px-2 py-1 text-[10px] ${granularity === key ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>{label}</button>)}</div></div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
                    <defs><linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8df73" stopOpacity={0.24} /><stop offset="95%" stopColor="#b8df73" stopOpacity={0} /></linearGradient><linearGradient id="loginFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#52c9c3" stopOpacity={0.18} /><stop offset="95%" stopColor="#52c9c3" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid stroke="#ffffff0b" vertical={false} />
                    <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} minTickGap={24} />
                    <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="users" name="Altas" stroke="#b8df73" fill="url(#usersFill)" strokeWidth={2.5} activeDot={{ r: 4, fill: '#b8df73', stroke: '#151b20', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="logins" name="Accesos" stroke="#52c9c3" fill="url(#loginFill)" strokeWidth={2} activeDot={{ r: 4, fill: '#52c9c3', stroke: '#151b20', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={`${panel} p-5 md:p-6`}>
              <div className="mb-2"><h2 className="font-semibold text-white">Horarios de acceso</h2><p className="mt-1 text-xs text-slate-500">Inicios de sesión · últimos 7 días</p></div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.hourlyLogins} margin={{ top: 16, right: 0, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke="#ffffff0b" vertical={false} />
                    <XAxis dataKey="hour" tickFormatter={(hour) => `${String(hour).padStart(2, '0')}h`} tick={tickStyle} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip hourMode />} />
                    <Bar dataKey="count" name="Accesos" fill="#8f83e8" radius={[5, 5, 0, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Zona horaria: Argentina (UTC−3)</p>
            </div>
          </section>
        </>}

        {(view === 'overview' || view === 'operations') && <>
          <div className="flex items-end justify-between gap-4 pt-1"><div><h2 className="text-lg font-semibold text-white">Estado de la aplicación</h2><p className="mt-1 text-xs text-slate-500">Métricas del proceso Node y conexión a la base de datos</p></div><span className="text-[11px] text-slate-500">Actualizado {new Date(data.generatedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <HealthCard label="Base de datos" value={data.database.connected ? 'Conectada' : 'Sin conexión'} detail={data.database.connected ? `Respuesta al ping · ${data.database.latencyMs} ms` : 'No disponible'} icon={<FiDatabase />} status={data.database.connected ? 'good' : 'bad'} />
            <HealthCard label="CPU del proceso" value={data.process.cpuPercent === null ? 'Midiendo…' : `${data.process.cpuPercent}%`} detail="Proceso Node · respecto a un núcleo" icon={<FiActivity />} status="neutral" />
            <HealthCard label="Memoria del proceso" value={formatBytes(data.process.memory.rss)} detail={`Heap usado ${formatBytes(data.process.memory.heapUsed)} / ${formatBytes(data.process.memory.heapTotal)}`} icon={<FiServer />} status="neutral" />
            <HealthCard label="Tiempo activo" value={formatDuration(data.process.uptimeSeconds)} detail={`${data.process.nodeVersion} · runtime Node.js`} icon={<FiClock />} status="neutral" />
          </section>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className={`${panel} flex gap-4 p-5`}><div className="rounded-xl bg-[#b8df73]/10 p-3 text-[#b8df73]"><FiActivity size={18} /></div><div><h3 className="text-sm font-semibold text-white">Métricas disponibles ahora</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">CPU y memoria corresponden al proceso web que atendió esta consulta. Para graficar tendencias o ver el uso total del contenedor, falta conectar un recolector externo.</p></div></div>
            <div className={`${panel} flex gap-4 p-5`}><div className="rounded-xl bg-amber-300/10 p-3 text-amber-200"><FiAlertCircle size={18} /></div><div><h3 className="text-sm font-semibold text-white">Infraestructura ampliada</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">CPU del host, disco, red del contenedor, solicitudes por segundo y latencia p95 todavía no están instrumentados. No se muestran valores estimados.</p></div></div>
          </div>
        </>}

        {(view === 'overview' || view === 'audit' || view === 'operations') && <section className={`${panel} overflow-hidden`}>
          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] p-5 md:flex-row md:items-center md:px-6">
            <div><h2 className="font-semibold text-white">{view === 'operations' ? 'Errores y advertencias' : 'Registro de actividad'}</h2><p className="mt-1 text-xs text-slate-500">Accesos, cambios de administración y eventos de la app</p></div>
            <div className="flex flex-wrap gap-1.5">{[['all', 'Todo'], ['errors', 'Errores'], ['access', 'Accesos'], ['audit', 'Auditoría']].map(([key, label]) => <button key={key} onClick={() => setEventFilter(key)} className={`rounded-lg px-3 py-1.5 text-xs ${eventFilter === key ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-200'}`}>{label}</button>)}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-white/[0.025] text-[10px] uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-6 py-3 font-medium">Fecha y hora</th><th className="px-4 py-3 font-medium">Evento</th><th className="px-4 py-3 font-medium">Usuario</th><th className="px-4 py-3 font-medium">Detalle</th><th className="px-4 py-3 font-medium">Ruta</th></tr></thead>
              <tbody className="divide-y divide-white/[0.05]">{visibleEvents.length ? visibleEvents.map((event) => <tr key={event.id} className="hover:bg-white/[0.025]"><td className="whitespace-nowrap px-6 py-3.5 text-slate-400">{new Date(event.createdAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td><td className="px-4 py-3.5"><EventBadge type={event.type} /></td><td className="px-4 py-3.5 text-slate-300">{event.actor}</td><td className="max-w-[360px] truncate px-4 py-3.5 text-slate-400">{event.message || event.action || (event.targetId ? `Cuenta ${event.targetId.slice(-6)}` : '—')}</td><td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">{event.route || '—'}</td></tr>) : <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No hay eventos para este filtro en el período.</td></tr>}</tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.06] px-6 py-3 text-[11px] text-slate-600">Vista reciente · hasta 60 eventos · actualización cada 30 segundos</div>
        </section>}
      </>}
    </div>
  );
}

function StatCard({ title, value, note, icon, tone }: { title: string; value: string; note: string; icon: React.ReactNode; tone: string }) {
  const colors: Record<string, string> = { lime: 'text-[#b8df73] bg-[#b8df73]/10', cyan: 'text-[#52c9c3] bg-[#52c9c3]/10', violet: 'text-[#a99cf6] bg-[#a99cf6]/10', rose: 'text-[#fb8d91] bg-[#fb8d91]/10', slate: 'text-slate-300 bg-white/5' };
  return <div className={`${panel} group p-5 transition hover:-translate-y-0.5 hover:border-white/[0.12]`}><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-400">{title}</span><span className={`rounded-xl p-2.5 ${colors[tone]}`}>{icon}</span></div><div className="mt-4 text-[30px] font-semibold leading-none tracking-tight text-white">{value}</div><div className="mt-2 text-[11px] text-slate-500">{note}</div></div>;
}
function HealthCard({ label, value, detail, icon, status }: { label: string; value: string; detail: string; icon: React.ReactNode; status: 'good' | 'bad' | 'neutral' }) {
  const dot = status === 'good' ? 'bg-emerald-400 shadow-[0_0_9px_#34d399]' : status === 'bad' ? 'bg-rose-400 shadow-[0_0_9px_#fb7185]' : 'bg-[#9ebd67]';
  return <div className={`${panel} p-5`}><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-400">{label}</span><span className="text-slate-500">{icon}</span></div><div className="mt-4 flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${dot}`} /><span className="text-xl font-semibold text-white">{value}</span></div><p className="mt-2 text-[11px] text-slate-500">{detail}</p></div>;
}
function Legend({ color, label }: { color: string; label: string }) { return <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: color }} />{label}</span>; }
function EventBadge({ type }: { type: string }) {
  const style = type === 'app_error' ? 'bg-rose-400/10 text-rose-300' : type === 'app_warning' || type === 'login_failed' ? 'bg-amber-300/10 text-amber-200' : type === 'admin_action' ? 'bg-violet-300/10 text-violet-200' : 'bg-[#52c9c3]/10 text-[#76d7d1]';
  return <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium ${style}`}>{eventLabel(type)}</span>;
}
function ChartTooltip({ active, payload, label, hourMode = false }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string | number; hourMode?: boolean }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-white/10 bg-[#20282e] px-3 py-2.5 shadow-xl"><p className="mb-1.5 text-[11px] text-slate-400">{hourMode ? `${String(label).padStart(2, '0')}:00` : label}</p>{payload.map((item) => <p key={item.name} className="text-xs font-medium" style={{ color: item.color }}>{item.name}: {item.value}</p>)}</div>;
}
