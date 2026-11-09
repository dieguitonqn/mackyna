import React from 'react'
import Image from 'next/image'
function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/[0.06] bg-[#080b09] px-4 py-3">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Hecho por Diarmodev</p>
        <Image
          src="/diarmodev_logo2.jpg"
          alt="Diarmodev"
          width={25}
          height={25}
          className="h-auto w-[25px]"
        />
        <p>Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
