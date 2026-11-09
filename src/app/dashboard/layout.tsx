import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { getActiveSession } from "@/lib/getActiveSession";
import DashboardNav from "./DashboardNav";

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
    const session = await getActiveSession();
    const isAdmin = session?.user?.rol === "admin";

    return (
        <div className="flex min-h-screen bg-[#0b1014] text-slate-100">
            <aside className="sticky top-0 flex h-screen w-[76px] shrink-0 flex-col border-r border-white/[0.07] bg-[#10171c] px-3 py-5 md:w-[248px] md:px-4">
                <Link href="/dashboard" className="flex items-center gap-3 px-1 md:px-2">
                    <Image src="/mackyna.png" alt="Mackyna" width={40} height={40} className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />
                    <div className="hidden md:block"><p className="text-sm font-semibold tracking-wide text-white">MACKYNA</p><p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-500">Admin console</p></div>
                </Link>

                <div className="mt-8 flex min-h-0 flex-1 flex-col md:mt-5"><DashboardNav isAdmin={isAdmin} /></div>

                <div className="mt-auto border-t border-white/[0.07] pt-4">
                    <div className="mt-4 hidden items-center gap-2 px-3 text-[10px] text-slate-600 md:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#9fbd62]" /> Panel protegido</div>
                </div>
            </aside>
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-8">{children}</main>
        </div>
    );
}
