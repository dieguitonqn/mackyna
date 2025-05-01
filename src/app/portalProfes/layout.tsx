import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-scroll">
      {/* Sidebar */}
      <aside className="w-32 bg-gray-800 text-white flex flex-col">
        {/* Logo e información */}
        <div className="p-6 text-center justify-start">
          <Image
            src="/icono_profes.jpeg" // Cambia esta ruta a la de tu logo
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto rounded-full"
          />
          <h1 className="mt-4 text-sm font-bold">Mackyna de entrenar</h1>
        </div>

        {/* Links */}
        <nav className="mt-6 flex-grow">
          <ul className="space-y-2">
            <li>
              <Link href="/portalProfes/Alumnos">
                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  Alumnos
                </div>
              </Link>
            </li>
            <li>
              <Link href="/portalProfes/Ejercicios">
                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  Ejercicios
                </div>
              </Link>
            </li>
            <li>
              <Link href="/portalProfes/Reservas">
                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  Reservas
                </div>
              </Link>
            </li>
            <li>
                            <Link href="/portalProfes/Pagos">
                                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    Pagos
                                </div>
                            </Link>
                        </li>
            <li>
              <Link href="/portalProfes/newPlani">
                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  Nueva Rutina
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 text-sm text-center border-t border-gray-700">
          &copy; 2024 Mackyna
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 antialiased bg-gradient-to-r from-black via-green-700 to-black">
        {/* <h1 className="text-2xl font-bold text-gray-800">Portal de Profesores</h1> */}

        {children}
      </main>
    </div>
  );
}
