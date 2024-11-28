import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                {/* Logo e información */}
                <div className="p-6 text-center">
                    <Image
                        src="/icono_profes.jpeg" // Cambia esta ruta a la de tu logo
                        alt="Logo"
                        width={200}
                        height={200}
                        className="mx-auto rounded-full"
                    />
                    <h1 className="mt-4 text-lg font-bold">Mackyna Entrenamiento</h1>
                </div>

                {/* Links */}
                <nav className="mt-6 flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard/usuarios">
                                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    Usuarios
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/ejercicios">
                                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    Ejercicios
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/turnos">
                                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    Turnos
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/pagos">
                                <div className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    Pagos
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 text-sm text-center border-t border-gray-700">
                    &copy; 2024 Mi Gimnasio
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8">
                {/* <h1 className="text-2xl font-bold text-gray-800">Bienvenido al Dashboard</h1>
                <p className="mt-4 text-gray-600">
                    Usa el menú a la izquierda para navegar entre las secciones.
                </p> */}
                {children}
            </main>
        </div>
    );
};


