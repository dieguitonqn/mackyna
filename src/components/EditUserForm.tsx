// import FetchUsers from '@/lib/fetchUsers';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type EditUserFormProps = {
    email: string;
    onClose: () => void;
};

const EditUserForm: React.FC<EditUserFormProps> = ({ email, onClose }) => {
    const { data: session } = useSession();
    const canEditRole = session?.user?.rol === 'admin';
    const [targetRole, setTargetRole] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');
    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        email: email, // Pre-cargamos el email recibido
        rol: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Cargar la información del usuario
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }), // Enviar el email en el cuerpo de la solicitud
                });

                if (!response.ok) {
                    throw new Error('Error al cargar el usuario');
                }

                const data = await response.json();
                setUserData(data);
                setTargetRole(data.rol ?? '');
                setPendingEmail(data.pendingEmail ?? '');
                setNewEmail(data.pendingEmail ?? '');
            } catch (err: unknown) {
                setError('Error al cargar los datos del usuario'+err);
            }
        };

        fetchUser();
    }, [email, ]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
      
        try {
          const requestedEmail = newEmail.trim() || userData.email;
          const emailWasChanged = requestedEmail.trim().toLowerCase() !== userData.email.trim().toLowerCase();
          const response = await fetch('/api/usuarios', {
            method: 'PUT', // Método PUT para actualizar
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...userData, email: requestedEmail }),
          });
      
          if (!response.ok) {
            throw new Error(await response.text() || 'Error al actualizar los datos');
          }
          const result = await response.json();
          if (result.emailChangePending) {
            setPendingEmail(result.user?.pendingEmail ?? requestedEmail);
            alert('Datos actualizados. El cambio de email quedó pendiente de confirmación del alumno.');
          } else if (emailWasChanged) {
            alert('Usuario y email actualizados con éxito.');
          } else {
            alert('Usuario actualizado con éxito');
          }
          onClose(); // Cierra el formulario
          
        } catch (err: unknown) {
          setError('Error al actualizar el usuario'+err);
        } finally {
          setLoading(false);
        }
      };
      

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

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
                            value={userData.nombre}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="apellido" className="block text-gray-700">
                            Apellido
                        </label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value={userData.apellido}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newEmail" className="block text-gray-700">
                            {targetRole === 'user' ? 'Solicitar cambio de email' : 'Email'}
                        </label>
                        <input
                            type="email"
                            id="newEmail"
                            name="newEmail"
                            value={newEmail}
                            placeholder={userData.email}
                            onChange={(event) => setNewEmail(event.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            disabled={!canEditRole && targetRole !== 'user'}
                        />
                        {targetRole === 'user' && <p className="mt-1 text-sm text-gray-600">El email actual no cambia hasta que el alumno confirme desde su sesión.</p>}
                        {pendingEmail && <p className="mt-1 text-sm text-amber-700">Pendiente de confirmación: {pendingEmail}</p>}
                    </div>
                    {canEditRole && <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">
                            Rol
                        </label>
                        <select
                            id="rol"
                            name="rol"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1 px-2 bg-white"
                            value={userData.rol}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const { name, value } = e.target;
                                setUserData((prev) => ({ ...prev, [name]: value }));
                              }}
                        >
                            <option value={userData.rol}>{userData.rol}</option>
                            <option value="admin">admin</option>
                            <option value="teacher">teacher</option>
                            <option value="teach">teach (legacy)</option>
                            <option value="user">user</option>
                        </select>
                        
                    </div>}
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
    );
};

export default EditUserForm;
