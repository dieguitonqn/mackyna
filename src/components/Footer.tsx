import React from 'react'
import Image from 'next/image'
function Footer() {
  return (
    <div>
      <footer className="py-2 bg-black">
        <div className="flex flex-row mx-auto items-center justify-center text-center gap-2">
          <p className="flex flex-row text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Hecho por Diarmodev  
          </p>
          <Image src={"/diarmodev_logo2.jpg"} alt='diarmodev logo' width={25} height={25} />
          <p className="flex flex-row text-sm text-gray-500"> - Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
