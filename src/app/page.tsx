

// import { useSession, getSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Wap } from "@/components/wap";

export default function Page() {

  return (
    <>

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center h-screen bg-gradient-to-b from-black via-gray-900 to-green-900">
          <Image
            src="/mackyna_verde.png"
            alt="Gimnasio Logo"
            width={300}
            height={300}
            className="mb-4" />
          <h1 className="text-4xl font-extrabold text-green-500 md:text-6xl">
            Transforma tu cuerpo, transforma tu vida
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Entrenamientos personalizados y las mejores instalaciones para vos.
          </p>
          <div className="mt-6 flex gap-4">
            <Link href={"/signUp"} className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-500 rounded-lg">
              ¡Inscribite ahora!
            </Link>
            <Link href="/#beneficios" className="px-6 py-3 text-lg font-semibold bg-white text-black rounded-lg hover:bg-gray-200">
              Conoce más
            </Link>
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
              <h3 className="text-xl font-semibold">Entrenamiento personalizado</h3>
              <p className="mt-2 text-gray-400">Planes diseñados para tus metas.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-semibold">Clases grupales</h3>
              <p className="mt-2 text-gray-400">Motívate con otros en clases dinámicas.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-semibold">Instalaciones modernas</h3>
              <p className="mt-2 text-gray-400">Equipos de última tecnología.</p>
            </div>
          </div>
        </section>

        <section>
          <Image 
          src={"/precios.jpeg"}
          alt="precios de enero"
          width={1920}
          height={1080}
          className="my-20"
          />
        </section>
        <Wap />
        {/* Footer */}

      </div>
    </>
  );
}