// import { useSession, getSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Wap } from "@/components/wap";
import { Galeria } from "@/components/Galeria";
import { getHomeData } from "@/lib/getHomeData";
import { HomeData } from "@/types/homeData";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { FaArrowCircleRight } from "react-icons/fa";
import GoogleMap from "@/components/GoogleMap";

export const dynamic = "force-dynamic"; // Para evitar el cacheo de la página
export default async function Page() {
  const {
    title,
    description,
    logo_principal,
    carrousel,
  }: HomeData = (await getHomeData()) ?? {
    title: null,
    description: null,
    logo_principal: null,
    carrousel: [],
  };
  const carrouselImages =
    carrousel?.map((item: { url: string }) => item.url) || [];

  // console.log("Home data:", { title, description, logo_principal });
  return (
    <div>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center h-screen bg-gradient-to-b from-black via-gray-900 to-green-900">
          <Image
            src={logo_principal ? logo_principal : "/mackyna_verde.png"}
            alt="Gimnasio Logo"
            width={300}
            height={300}
            className="mb-4"
          />
          <h1
            className="text-4xl md:text-6xl font-extrabold text-green-500"
            style={{ fontSize: "2.25rem" }}
          >
            {title ? title : "Transforma tu cuerpo, transforma tu vida"}
          </h1>
          <div className="mt-4 text-lg md:text-xl [&>p>strong]:font-bold">
            {description ? (
              <BlocksRenderer content={description} />
            ) : (
              "Entrenamientos personalizados y las mejores instalaciones para vos."
            )}
          </div>
          <div className="mt-6 flex gap-4">
            <Link
              href={"/signUp"}
              className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-500 rounded-lg"
            >
              ¡Inscribite ahora!
            </Link>
            <Link
              href="/#beneficios"
              className="px-6 py-3 text-lg font-semibold bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Conoce más
            </Link>
          </div>
        </section>
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-500 mb-8">
              Nuestra Ubicación
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">
                      Visitanos en nuestro gimnasio
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>
                        📍 Dirección: Juan XXIII 1659, Neuquen, Patagonia,
                        Argentina
                      </p>
                      <p>📞 Teléfono: +54 9 2994 63-0512</p>
                      <p>🕐 Horarios: Lun-Vie 7:00-22:00</p>
                    </div>
                    <Link
                      href="https://www.google.com/maps/dir/?api=1&destination=-38.952785297081135,-68.0361700090555"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <span>Cómo llegar</span>
                      <FaArrowCircleRight />
                    </Link>
                  </div>
                  <div className="h-64 lg:h-full min-h-[300px] rounded-lg overflow-hidden">
                    <GoogleMap
                      lat={-38.952785297081135}
                      lng={-68.0361700090555}
                      zoom={15}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Beneficios */}
        <section id="beneficios" className="py-16 bg-gray-900">
          <h2 className="text-3xl font-bold text-center text-green-500">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-semibold">
                Entrenamiento personalizado
              </h3>
              <p className="mt-2 text-gray-400">
                Planes diseñados para tus metas.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-semibold">Clases grupales</h3>
              <p className="mt-2 text-gray-400">
                Motívate con otros en clases dinámicas.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-semibold">Instalaciones modernas</h3>
              <p className="mt-2 text-gray-400">
                Equipos de última tecnología.
              </p>
            </div>
          </div>
          <Galeria images={carrouselImages} />
        </section>

      </div>
    </div>
    );
}
