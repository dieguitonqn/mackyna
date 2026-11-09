import React, { useEffect, useState } from 'react'
type EditEjercicioFormProps = {
  _id: string;
  onClose: () => void;
}

const EditEjercicioForm: React.FC<EditEjercicioFormProps> = ({ _id, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ejercicioData, setEjercicioData] = useState({
    _id: _id,
    nombre: '',
    grupoMusc: '',
    specificMusc: '',
    description: '',
    video: ''
  })

  useEffect(() => {
    const fetchEjercicio = async () => {
      try {
        const response = await fetch(`/api/ejercicios?id=${ejercicioData._id}`);

        if (!response.ok) {
          throw new Error('Error al cargar el ejercicio');
        }

        const data = await response.json();
        setEjercicioData(data);
      } catch (err: unknown) {
        setError('Error al cargar los datos del ejercicio' + err);
      }
    };

    fetchEjercicio();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEjercicioData((prev) => ({ ...prev, [name]: value }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/ejercicios', {
        method: 'PUT', // Método PUT para actualizar
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...ejercicioData }), // Enviar email y los datos actualizados
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }
  
      alert('Ejercicio actualizado con éxito');
      onClose(); // Cierra el formulario
      
    } catch (err: unknown) {
      setError('Error al actualizar el ejercicio: '+err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#111713] p-5 shadow-2xl sm:p-6">
        <h2 className="mb-5 text-xl font-semibold text-white">Editar ejercicio</h2>

        {error && <p className="mb-4 rounded-xl border border-rose-300/15 bg-rose-400/[0.08] p-3 text-sm text-rose-200">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-300">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={ejercicioData.nombre}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
              required
            />
          </div>

          {/* <div className="mb-4">
            <label htmlFor="grupoMusc" className="block text-gray-700">
              Grupo Muscular
            </label>
            <input
              type="text"
              id="grupoMusc"
              name="grupoMusc"
              value={ejercicioData.grupoMusc}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div> */}

          <div className="mb-4">
            <label htmlFor="specificMusc" className="block text-sm font-medium text-slate-300">
              Músculo Específico
            </label>
            <input
              type="text"
              id="specificMusc"
              name="specificMusc"
              value={ejercicioData.specificMusc}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
              
            />
          </div>
        
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-2 block w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
              value={ejercicioData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const { name, value } = e.target;
                setEjercicioData((prev) => ({ ...prev, [name]: value }));
              }}
            >
            </textarea>

          </div>

          <div className="mb-4">
            <label htmlFor="video" className="block text-sm font-medium text-slate-300">
              Video
            </label>
            <input
              type="text"
              id="video"
              name="video"
              value={ejercicioData.video}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
              
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-xl bg-[#b9dc75] px-4 py-2.5 text-sm font-semibold text-[#172016] transition ${loading ? 'opacity-50' : 'hover:bg-[#c9e991]'
                }`}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEjercicioForm
