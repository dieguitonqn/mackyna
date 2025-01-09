import React, { useState } from 'react'
type NewEjercicioFormProps = {
    onClose: () => void;
  }

const NewEjercicioForm: React.FC <NewEjercicioFormProps>= ({onClose}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ejercicioData, setEjercicioData] = useState({
    nombre: '',
    grupoMusc: '',
    specificMusc: '',
    description: '',
    video: ''
  })

  
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
        method: 'POST', // Método POST para agregar
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...ejercicioData }), 
      });
  
      if (!response.ok) {
        throw new Error('Error al cargar el nuevo ejercicio');
      }
  
      alert('Ejercicio agregado con éxito');
      onClose(); // Cierra el formulario
      
    } catch (err: unknown) {
      setError('Error al agregar el ejercicio: '+err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Nuevo Ejercicio</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={ejercicioData.nombre}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            <label htmlFor="specificMusc" className="block text-gray-700">
              Músculo Específico
            </label>
            <input
              type="text"
              id="specificMusc"
              name="specificMusc"
              value={ejercicioData.specificMusc}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1 px-2 bg-white"
              value={ejercicioData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const { name, value } = e.target;
                setEjercicioData((prev) => ({ ...prev, [name]: value }));
              }}
            >
            </textarea>

          </div>
          <div className="mb-4">
            <label htmlFor="video" className="block text-gray-700">
              Video
            </label>
            <input
              type="text"
              id="video"
              name="video"
              value={ejercicioData.video}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50' : 'hover:bg-blue-700'
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

export default NewEjercicioForm
