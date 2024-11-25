import React from "react";
import Link from "next/link";
import Image from "next/image";

interface card {
  imagen: string,
  titulo: string,
  desc: string,
  link: string
}


function CardInit({ imagen, titulo, desc, link }: card) {
  return (
    <div className="flex flex-col bg-white border border-slate-500 max-w-80">
      <Link href={link}>
        <div className="flex w-full border border-slate-400 items-center justify-center p-5">
          <Image
            src={imagen}
            alt={desc}
            width={200}
            height={200}
          />
        </div>
        <div className=" flex flex-col w-full border border-slate-400 p-5 gap-2">
          <p className="text-2xl font-semibold">{titulo}</p>
          <p>{desc}</p>
          {/* Descripción */}
        </div>
      </Link >
    </div>

  )
}

export default CardInit
