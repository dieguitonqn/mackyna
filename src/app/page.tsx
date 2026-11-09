import Image from "next/image";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import {
  FiActivity, FiArrowDown, FiArrowUpRight, FiCheck, FiMapPin,
  FiMove, FiTrendingUp, FiUserCheck,
} from "react-icons/fi";
import { Galeria } from "@/components/Galeria";
import LocationMap from "@/components/LocationMap";
import { getHomeData } from "@/lib/getHomeData";
import { HomeData } from "@/types/homeData";

export const dynamic = "force-dynamic";

const gymAddress = "Juan XXIII 1659, Neuquén, Patagonia, Argentina";
const latitude = -38.952785297081135;
const longitude = -68.0361700090555;
const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;

const benefits = [
  {
    icon: FiUserCheck,
    number: "01",
    title: "Un plan para vos",
    description: "Rutinas personalizadas, pensadas por profes y adaptadas a tu objetivo y experiencia.",
  },
  {
    icon: FiTrendingUp,
    number: "02",
    title: "Tu progreso, visible",
    description: "Registrá tus métricas y mirá cómo evoluciona tu recorrido con el paso del tiempo.",
  },
  {
    icon: FiActivity,
    number: "03",
    title: "Acompañamiento real",
    description: "Entrená en un espacio cercano, con orientación profesional y objetivos claros.",
  },
];

export default async function Page() {
  const homeData: HomeData = (await getHomeData()) ?? {
    title: null, description: null, logo_principal: null, carrousel: [], prices: null,
  };
  const carrouselImages = homeData.carrousel?.map((item: { url: string }) => item.url) ?? [];
  const galleryImages = carrouselImages.length > 0
    ? carrouselImages
    : ["/mackyna/gym6.jpeg", "/mackyna/gym7.jpeg"];
  const pricesImage = homeData.prices ?? {
    url: "/pricesJuly.jpeg",
    width: 1600,
    height: 1132,
  };
  return (
    <main className="overflow-hidden bg-[#0b0e0c] text-white">
      <section className="relative isolate flex min-h-[700px] items-center sm:min-h-[760px]">
        <Image
          src="/mackyna/gym1.jpeg"
          alt="Vista del espacio de entrenamiento Mackyna"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center opacity-65"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,12,9,.97)_0%,rgba(8,12,9,.87)_43%,rgba(8,12,9,.24)_100%),linear-gradient(0deg,rgba(8,12,9,.92)_0%,transparent_32%)]" />
        <div className="absolute right-[8%] top-[18%] -z-10 hidden h-[440px] w-[310px] rotate-[4deg] overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl shadow-black/60 lg:block">
          <Image src="/mackyna/gym5.jpeg" alt="Equipamiento del gimnasio" fill sizes="310px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 flex items-center gap-2 text-xs font-medium text-white/90"><span className="h-2 w-2 rounded-full bg-[#b9dc75]" /> Mackyna · Neuquén</span>
        </div>

        <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <div className="relative mb-7 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
              <span className="absolute inset-0 rounded-full border border-[#b9dc75]/30 shadow-[0_0_35px_rgba(185,220,117,.12)]" />
              <span className="absolute inset-2 rounded-full border border-[#b9dc75]/15" />
              <span className="absolute inset-4 rounded-full bg-[#b9dc75]/[0.12] blur-xl" />
              <span className="relative flex h-[82%] w-[82%] items-center justify-center rounded-full border border-white/[0.08] bg-[#0b0e0c]/65 p-3 backdrop-blur-sm">
                <Image
                  src={homeData.logo_principal || "/mackyna_verde.png"}
                  alt="Logo de Mackyna"
                  width={300}
                  height={300}
                  className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(185,220,117,.42)]"
                />
              </span>
            </div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b9dc75]/25 bg-[#b9dc75]/[0.08] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c6e58d] sm:text-xs">
              <FiMapPin size={13} /> Entrenamiento en Neuquén
            </div>
            <h1 className="max-w-[850px] text-[clamp(3.3rem,8vw,6.5rem)] font-semibold leading-[0.96] tracking-[-0.065em] text-white">
              {homeData.title || <>Construí tu <span className="text-[#b9dc75]">mejor versión.</span></>}
            </h1>
            <div className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8 [&_a]:text-[#c6e58d] [&_p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-white">
              {homeData.description ? (
                <BlocksRenderer content={homeData.description} />
              ) : (
                <p>Entrenamiento personalizado, seguimiento de tu progreso y un equipo que te acompaña en cada etapa.</p>
              )}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signUp" className="group inline-flex items-center gap-3 rounded-xl bg-[#b9dc75] px-5 py-3.5 text-sm font-semibold text-[#172016] shadow-lg shadow-[#b9dc75]/10 transition hover:-translate-y-0.5 hover:bg-[#c9e991]">
                Empezá hoy <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={17} />
              </Link>
              <Link href="#espacio" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-white/[0.09]">
                Conocé el espacio
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/55">
              <span className="inline-flex items-center gap-2"><FiCheck className="text-[#b9dc75]" /> Planificación personal</span>
              <span className="inline-flex items-center gap-2"><FiCheck className="text-[#b9dc75]" /> Seguimiento de métricas</span>
              <span className="inline-flex items-center gap-2"><FiCheck className="text-[#b9dc75]" /> Acompañamiento profesional</span>
            </div>
          </div>
        </div>
        <a href="#beneficios" aria-label="Ver beneficios" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45 transition hover:text-white/80 md:flex">
          Descubrí Mackyna <FiArrowDown className="animate-bounce" />
        </a>
      </section>

      <section id="ubicacion" className="scroll-mt-20 bg-[#101511] px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b9dc75]">Encontranos · Neuquén</p>
            <h2 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">Estamos acá.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/55">{gymAddress}</p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
              <a href="tel:+5492994630512" className="transition hover:text-[#b9dc75]">+54 9 2994 63-0512</a>
              <span>Lun–Vie · 7:00 a 22:00</span>
            </div>
            <a href={openStreetMapUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-[#b9dc75]/25 bg-[#b9dc75]/[0.08] px-3.5 py-2.5 text-xs font-semibold text-[#c6e58d] transition hover:bg-[#b9dc75]/[0.15]">Cómo llegar <FiMove /></a>
          </div>
          <div className="h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#e7e7e1] sm:h-[320px]">
            <LocationMap lat={latitude} lng={longitude} />
          </div>
        </div>
        <p className="mx-auto mt-2 max-w-7xl text-right text-[10px] text-white/30">Mapa © OpenStreetMap contributors</p>
      </section>

      <section className="border-y border-white/[0.07] bg-[#101511]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 text-xs font-medium text-white/65 sm:grid-cols-3 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 sm:justify-center"><span className="h-1.5 w-1.5 rounded-full bg-[#b9dc75]" /> Entrenamiento personalizado</div>
          <div className="flex items-center gap-3 sm:justify-center"><span className="h-1.5 w-1.5 rounded-full bg-[#b9dc75]" /> Seguimiento de tu evolución</div>
          <div className="flex items-center gap-3 sm:justify-center"><span className="h-1.5 w-1.5 rounded-full bg-[#b9dc75]" /> Un espacio en Neuquén</div>
        </div>
      </section>

      <section id="beneficios" className="scroll-mt-20 bg-[#0b0e0c] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b9dc75]">Más que entrenar</p>
              <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">Un método que <span className="text-[#b9dc75]">avanza con vos.</span></h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/55 lg:justify-self-end">Cada persona parte de un lugar distinto. Por eso combinamos planificación, seguimiento y acompañamiento para que entrenes con dirección y puedas ver tu evolución.</p>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {benefits.map(({ icon: Icon, number, title, description }) => (
              <article key={number} className="group rounded-2xl border border-white/[0.08] bg-[#111713] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b9dc75]/25 hover:bg-[#151d16] sm:p-7">
                <div className="flex items-start justify-between"><span className="rounded-xl border border-[#b9dc75]/15 bg-[#b9dc75]/[0.08] p-3 text-[#b9dc75]"><Icon size={19} /></span><span className="font-mono text-xs text-white/25">{number}</span></div>
                <h3 className="mt-8 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="espacio" className="scroll-mt-20 bg-[#111713] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto mt-16 max-w-7xl border-t border-white/[0.07] pt-12">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b9dc75]">El espacio · Mackyna</p><h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Así se vive el gimnasio.</h2></div>
            <p className="max-w-sm text-sm text-white/50">Un vistazo a nuestro espacio, equipamiento y rincones para entrenar.</p>
          </div>
          <Galeria images={galleryImages} />
        </div>
      </section>

      <section className="border-y border-[#b9dc75]/15 bg-[#b9dc75] px-5 py-14 text-[#172016] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#39472a]/70">Tu próximo paso</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Empezá a entrenar con intención.</h2></div>
          <Link href="/signUp" className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#111713] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#253025] sm:self-auto">Crear mi cuenta <FiArrowUpRight size={17} /></Link>
        </div>
      </section>

      <section id="precios" aria-label="Precios del mes" className="bg-[#0b0e0c]">
        <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 lg:px-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b9dc75]">Planes Mackyna</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Precios del mes</h2>
          {!homeData.prices && <p className="mt-2 text-xs text-white/50">Imagen de referencia. Consultá los valores vigentes por WhatsApp.</p>}
        </div>
        <Image
          src={pricesImage.url}
          alt="Planes y precios del mes en Mackyna"
          width={pricesImage.width || 1920}
          height={pricesImage.height || 800}
          sizes="100vw"
          className="block h-auto w-full object-contain"
        />
      </section>
    </main>
  );
}
