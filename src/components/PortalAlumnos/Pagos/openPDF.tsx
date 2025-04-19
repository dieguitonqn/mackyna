"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const OpenPDF = ({ ruta }: { ruta: string }) => {
  const { data: session, status } = useSession();
  const [urlRecibo, setUrlRecibo] = useState<string | null>(null);
  const [verRecibo, setVerRecibo] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && ruta) {
      setUrlRecibo(`/api/recibos?ruta=${ruta}`);
    }
  }, [status, ruta]);

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (status === "unauthenticated") {
    return <p>No autorizado para ver este recibo.</p>;
  }

  if (urlRecibo) {
    return <div>

      <button
        onClick={() => setVerRecibo(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Ver recibo
      </button>
      {verRecibo && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full">
          <button
            onClick={() => setVerRecibo(false)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Cerrar
          </button>
          <iframe src={urlRecibo} width="100%" height="600px" />
        </div>
      </div>
      )
      }
    </div>;
  } else {
    return <p>Sin recibo</p>;
  }

  return null;
};

export default OpenPDF;
