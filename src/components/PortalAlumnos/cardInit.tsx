import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

interface CardInitProps {
  imagen: string,
  titulo: string,
  desc: string,
  link: string
}

function CardInit({ imagen, titulo, desc, link }: CardInitProps) {
  return (
    <Link
      href={link}
      className="group flex min-h-[21rem] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111713] text-left shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] transition duration-300 hover:-translate-y-1 hover:border-[#c8e994]/45 hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8e994] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e0c]"
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c2920] via-[#142019] to-[#101512] px-8 py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(200,233,148,0.13),transparent_58%)]" />
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-black/15 p-4 transition-transform duration-300 group-hover:scale-105">
          <Image
            src={imagen}
            alt=""
            width={200}
            height={200}
            className="h-full w-full object-contain drop-shadow-xl"
          />
        </div>
        
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{titulo}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{desc}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c8e994]">
          Explorar
          <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export default CardInit
