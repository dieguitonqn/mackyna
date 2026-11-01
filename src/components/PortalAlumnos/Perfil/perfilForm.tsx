'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FormUserValues } from '@/types/user';
import { parseDateOnlyToUTC, toDateInputValue } from '@/utils/dateOnly';


const UserForm = ({ user, isOwnProfile = true }: { user: FormUserValues; isOwnProfile?: boolean }) => {
  const { data: session } = useSession();
  const canManageTarget = isOwnProfile || user.rol === 'user' || session?.user?.rol === 'admin';
  const canEditTargetEmail = user.rol === 'user' || session?.user?.rol === 'admin';

  const [formValues, setFormValues] = useState<FormUserValues>({
    _id: user._id,
    nombre: user.nombre,
    apellido: user.apellido || "",
    genero: user.genero || "",
    fecha_nacimiento: user.fecha_nacimiento || null,
    localidad: user.localidad || "",
    telefono: user.telefono || "",
    email: user.email,
    pendingEmail: user.pendingEmail,
    rol: user.rol,
    altura: user.altura || 0,
    objetivo: user.objetivo || "",
    lesiones: user.lesiones || "",
    redes: {
      Facebook: user.redes?.Facebook || '',
      Instagram: user.redes?.Instagram || "",
      Twitter: user.redes?.Twitter || "",
    },
  });

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [changePwd, setChangePwd] = useState(false);
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const [emailConfirmAddress, setEmailConfirmAddress] = useState('');
  const [emailChangeBusy, setEmailChangeBusy] = useState(false);
  const [requestedEmail, setRequestedEmail] = useState(user.pendingEmail || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormValues({
      ...formValues,
      fecha_nacimiento: date,
    });
  };

  const handleConfirmEmailChange = async () => {
    if (!formValues.pendingEmail) return;
    if (emailConfirmAddress.trim().toLowerCase() !== formValues.pendingEmail.toLowerCase()) {
      window.alert('El email ingresado no coincide con el email pendiente.');
      return;
    }
    if (!emailConfirmPassword) {
      window.alert('Ingresá tu contraseña actual para confirmar el cambio.');
      return;
    }

    setEmailChangeBusy(true);
    try {
      const response = await fetch('/api/me/email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: emailConfirmPassword,
          newEmail: emailConfirmAddress,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        window.alert(result?.error || 'No se pudo confirmar el cambio de email.');
        return;
      }

      setFormValues((previous) => ({ ...previous, email: result.email, pendingEmail: undefined }));
      setEmailConfirmPassword('');
      setEmailConfirmAddress('');
      window.dispatchEvent(new Event('profile-updated'));
      window.alert('Email actualizado. Cerrá sesión y volvé a ingresar con el nuevo email.');
    } catch {
      window.alert('No se pudo confirmar el cambio de email.');
    } finally {
      setEmailChangeBusy(false);
    }
  };

  const handleRejectEmailChange = async () => {
    if (!window.confirm('¿Querés rechazar y cancelar esta solicitud de cambio de email?')) return;
    setEmailChangeBusy(true);
    try {
      const response = await fetch('/api/me/email-change', { method: 'DELETE' });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        window.alert(result?.error || 'No se pudo cancelar la solicitud.');
        return;
      }
      setFormValues((previous) => ({ ...previous, pendingEmail: undefined }));
      setEmailConfirmPassword('');
      setEmailConfirmAddress('');
      window.alert('Solicitud de cambio cancelada.');
    } catch {
      window.alert('No se pudo cancelar la solicitud.');
    } finally {
      setEmailChangeBusy(false);
    }
  };

  const handleChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'newPwd') {
      setNewPwd(value);
    } else {
      setConfirmPwd(value);
    }
  };

  const handleSubmitNewPwd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      window.alert('Las contraseñas no coinciden');
      return;
    }
    if (isOwnProfile && !currentPwd) {
      window.alert('Ingresá tu contraseña actual');
      return;
    }
    try {
      const response = await fetch(isOwnProfile ? '/api/me/password' : '/api/userP', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isOwnProfile
          ? { currentPassword: currentPwd, newPassword: newPwd }
          : { _id: formValues._id, pwd: newPwd }),
      });
      if (response.ok) {
        window.alert('Contraseña actualizada correctamente');
        setChangePwd(false);
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      } else {
        const result = await response.json().catch(() => null);
        window.alert(result?.error || 'No se pudo actualizar la contraseña');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    }
  }

  const handleRedesChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormValues({
      ...formValues,
      redes: {
        ...formValues.redes,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const profilePayload = {
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      genero: formValues.genero,
      fecha_nacimiento: formValues.fecha_nacimiento
        ? toDateInputValue(formValues.fecha_nacimiento)
        : null,
      localidad: formValues.localidad,
      telefono: formValues.telefono,
      altura: formValues.altura,
      objetivo: formValues.objetivo,
      lesiones: formValues.lesiones,
      redes: formValues.redes,
    };

    try {

      const response = await fetch(isOwnProfile ? '/api/me' : '/api/usuarios', {
        method: isOwnProfile ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isOwnProfile
          ? profilePayload
          : { _id: formValues._id, email: requestedEmail.trim() || formValues.email, ...profilePayload }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        window.alert(result?.error || 'No se pudo actualizar el perfil');
        return;
      }

      if (!isOwnProfile && result?.emailChangePending) {
        setFormValues((previous) => ({ ...previous, pendingEmail: result.user?.pendingEmail }));
        setRequestedEmail(result.user?.pendingEmail ?? '');
        window.alert('Datos actualizados. El cambio de email quedó pendiente de confirmación del alumno.');
      } else {
        window.alert('Usuario actualizado correctamente');
      }
      window.dispatchEvent(new Event('profile-updated'));


    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }

    }


  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="md:w-3/4 w-full  m-auto justify-between  space-y-4 bg-green-100/15 flex flex-col my-10 p-10">
        <div className='flex flex-wrap gap-4'>
          <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
            <h1 className='text-2xl'>Datos De Usuario</h1>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mt-5">
                email:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formValues.email || ''}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
                disabled
              />
            </div>
            {!isOwnProfile && canEditTargetEmail && (
              <div className="mt-3">
                <label htmlFor="requestedEmail" className="block text-sm font-semibold">
                  {user.rol === 'user' ? 'Solicitar cambio de email' : 'Nuevo email'}:
                </label>
                <input
                  type="email"
                  id="requestedEmail"
                  autoComplete="email"
                  value={requestedEmail}
                  onChange={(event) => setRequestedEmail(event.target.value)}
                  placeholder={formValues.email}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
                {user.rol === 'user' && <p className="mt-1 text-sm">El email actual se mantiene hasta que el alumno confirme el cambio con su contraseña.</p>}
                {formValues.pendingEmail && <p className="mt-1 text-sm text-amber-700">Pendiente de confirmación: {formValues.pendingEmail}</p>}
              </div>
            )}
            {isOwnProfile && formValues.pendingEmail && (
              <div className="mt-4 rounded border border-amber-500 bg-amber-50 p-4">
                <h2 className="font-semibold">Solicitud de cambio de email</h2>
                <p className="mt-1 text-sm">El teacher solicita cambiar tu email a:</p>
                <p className="font-medium break-all">{formValues.pendingEmail}</p>
                <label htmlFor="emailConfirmAddress" className="mt-3 block text-sm font-semibold">
                  Confirmá el email nuevo:
                </label>
                <input
                  type="email"
                  id="emailConfirmAddress"
                  autoComplete="email"
                  value={emailConfirmAddress}
                  onChange={(event) => setEmailConfirmAddress(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
                <label htmlFor="emailConfirmPassword" className="mt-3 block text-sm font-semibold">
                  Contraseña actual:
                </label>
                <input
                  type="password"
                  id="emailConfirmPassword"
                  autoComplete="current-password"
                  value={emailConfirmPassword}
                  onChange={(event) => setEmailConfirmPassword(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={emailChangeBusy}
                    onClick={handleConfirmEmailChange}
                    className="rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
                  >
                    Confirmar cambio
                  </button>
                  <button
                    type="button"
                    disabled={emailChangeBusy}
                    onClick={handleRejectEmailChange}
                    className="rounded bg-gray-600 px-3 py-2 text-white disabled:opacity-50"
                  >
                    Rechazar solicitud
                  </button>
                </div>
              </div>
            )}


            <div className='flex justify-center my-2'>
              <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                onClick={(e) => {
                  e.preventDefault();
                  setChangePwd(!changePwd)
                }}>
                Cambiar Contraseña
              </button>
            </div>

          </div>
          <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
            <h1 className='text-2xl'>Datos De contacto</h1>
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold mt-5">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formValues.nombre || ''}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-semibold mt-5">
                Apellido:
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formValues.apellido}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="fecha_nacimiento" className="block text-sm font-semibold mt-5">
                Fecha de Nacimiento:
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={toDateInputValue(formValues.fecha_nacimiento)}
                onChange={(e) => handleDateChange(e.target.value ? parseDateOnlyToUTC(e.target.value) : null)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="localidad" className="block text-sm font-semibold mt-5">
                Localidad:
              </label>
              <input
                type="text"
                id="localidad"
                name="localidad"
                value={formValues.localidad}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-semibold mt-5">
                Telefono:
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formValues.telefono}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
            <h1 className='text-2xl'>Datos De Deportivos</h1>
            <div>
              <label htmlFor="altura" className="block text-sm font-semibold mt-5">
                Altura(m):
              </label>
              <input
                type="Number"
                id="altura"
                name="altura"
                value={formValues.altura}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="altura" className="block text-sm font-semibold mt-5">
                Género:
              </label>
              <select
                id="genero"
                name="genero"
                value={formValues.genero || ''}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="objetivo" className="block text-sm font-semibold mt-5">
                Objetivo:
              </label>
              <input
                type="text"
                id="objetivo"
                name="objetivo"
                value={formValues.objetivo}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="lesiones" className="block text-sm font-semibold mt-5">
                Observaciones:
              </label>
              <input
                type="text"
                id="lesiones"
                name="lesiones"
                value={formValues.lesiones}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className=' border border-slate-400 bg-slate-200 p-5 mx-auto'>
            <h1 className='text-2xl'>Redes</h1>
            <div>
              <label htmlFor="Facebook" className="block text-sm font-semibold mt-5">
                Facebook:
              </label>
              <input
                type="text"
                id="Facebook"
                name="Facebook"
                value={formValues.redes?.Facebook}
                onChange={handleRedesChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="Instagram" className="block text-sm font-semibold mt-5">
                Instagram:
              </label>
              <input
                type="text"
                id="Instagram"
                name="Instagram"
                value={formValues.redes?.Instagram}
                onChange={handleRedesChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="Twitter" className="block text-sm font-semibold mt-5">
                Twitter:
              </label>
              <input
                type="text"
                id="Twitter"
                name="Twitter"
                value={formValues.redes?.Twitter}
                onChange={handleRedesChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>


        {canManageTarget && <div className='flex justify-center mx-auto'>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>}
        {!canManageTarget && <p className="text-center text-white">Solo un administrador puede editar perfiles del personal.</p>}

      </form>
      {
        changePwd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className='bg-white p-5 rounded-lg'>
              {isOwnProfile && (
                <div>
                  <label htmlFor="currentPwd" className="block text-sm font-semibold mt-5">
                    Contraseña actual:
                  </label>
                  <input
                    type="password"
                    id="currentPwd"
                    name="currentPwd"
                    autoComplete="current-password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label htmlFor="newPwd" className="block text-sm font-semibold mt-5">
                  Contraseña nueva:
                </label>
                <input
                  type="password"
                  id="newPwd"
                  name="newPwd"
                  value={newPwd}
                  onChange={handleChangePwd}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="confirmPwd" className="block text-sm font-semibold mt-5">
                  Confirmar Contraseña:
                </label>
                <input
                  type="password"
                  id="confirmPwd"
                  name="confirmPwd"
                  value={confirmPwd}
                  onChange={(e) => handleChangePwd(e)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className='flex'>
                <div className='flex justify-center mx-auto my-5'>
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      setChangePwd(!changePwd)
                    }}>
                    Cancelar
                  </button>
                </div>
                <div className='flex justify-center mx-auto my-5'>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={(e) => handleSubmitNewPwd(e)}>
                    Guardar
                  </button>
                </div>

              </div>

            </div>
          </div>
        )
      }
    </div>

  );
};

export default UserForm;
