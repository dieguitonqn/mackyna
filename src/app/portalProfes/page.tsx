// 'use client'
// import connect from '@/lib/db';

import React from 'react';
// import { useEffect, useState } from 'react';

// import  { IUser } from "@/lib/models/user";
import User from "@/lib/models/user";
import { ConfettiComponent } from '@/components/PortalProfes/Confetti';
import connect from '@/lib/db';
import { formatDateOnlyEs, getUTCMonthDayKey } from '@/utils/dateOnly';

export const dynamic = 'force-dynamic';
const PaginaProfes = async() => {


    // const [users, setUsers] = useState<IUser[]>([]);
    // const [today, setToday] = useState(new Date());

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await fetch('/api/usuarios');
    //             const data = await response.json();
    //             setUsers(data);
    //             setToday(new Date());
    //         } catch (error) {
    //             console.error('Error fetching users:', error);
    //         }
    //     };

    //     fetchUsers();
    // }, []);
    
    connect();
    const users = await User.find().lean();
    const today = new Date();
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const getBirthdayDateForYear = (birthDate: Date | string, year: number) => {
        const parsed = new Date(birthDate);
        if (isNaN(parsed.getTime())) {
            return null;
        }

        return new Date(year, parsed.getUTCMonth(), parsed.getUTCDate());
    };
    
    const todayBirthdays = users.filter(user => {
        if (!user || !user.fecha_nacimiento) return false;
        return getUTCMonthDayKey(user.fecha_nacimiento) === todayKey;
    });

    const upcomingBirthdays = users
        .filter(user => {
            if (!user || !user.fecha_nacimiento) return false;

            const birthdayThisYear = getBirthdayDateForYear(user.fecha_nacimiento, today.getFullYear());
            if (!birthdayThisYear) return false;

            return birthdayThisYear > todayWithoutTime;
        })
        .sort((a, b) => {
            const aDate = getBirthdayDateForYear(a.fecha_nacimiento, today.getFullYear());
            const bDate = getBirthdayDateForYear(b.fecha_nacimiento, today.getFullYear());
            if (!aDate || !bDate) return 0;
            return aDate.getTime() - bDate.getTime();
        })
        .slice(0, 5);

    const pastBirthdays = users
        .filter(user => {
            if (!user || !user.fecha_nacimiento) return false;
            const birthdayThisYear = getBirthdayDateForYear(user.fecha_nacimiento, today.getFullYear());
            if (!birthdayThisYear) return false;
            return birthdayThisYear < todayWithoutTime;
        })
        .sort((a, b) => {
            const aDate = getBirthdayDateForYear(a.fecha_nacimiento, today.getFullYear());
            const bDate = getBirthdayDateForYear(b.fecha_nacimiento, today.getFullYear());
            if (!aDate || !bDate) return 0;
            return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 5);

    return (
        <div className='w-full md:w-3/4 lg:w-2/3 mx-auto p-4'>
            <h1 className=" text-2xl font-bold mb-4">Página principal de los profesores</h1>

            {/* Cumpleaños de hoy */}
            {todayBirthdays.length > 0 ? (
                <div className="mb-6 p-4 bg-green-100 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">🎉 Cumpleaños de hoy</h2>
                    <ul>
                        {todayBirthdays.map((user, index) => (
                            <li key={index} className="text-lg">
                                {user.nombre} {user.apellido}
                            </li>
                        ))}
                    </ul>
                    <ConfettiComponent repeat={false} />
                </div>
            ) : (
                <div className="mb-6 p-4 bg-yellow-100 rounded shadow">
                    <h2 className="text-xl font-semibold">🎂 No hay cumpleaños hoy</h2>
                </div>
            )}

            {/* Próximos cumpleaños */}
            <div className="p-4rounded shadow">
                {/* <h2 className="text-xl  bg-blue-100  font-semibold mb-2">Fecha: {today.getUTCDate()}-{ today.getUTCMonth()}</h2> */}
                <h2 className="text-xl  bg-blue-100  font-semibold mb-2">🎈 Próximos 5 cumpleaños</h2>
                <table className="table-auto w-full border-collapse border bg-blue-100  border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Apellido</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingBirthdays.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{user.nombre}</td>
                                 <td className="border border-gray-300 px-4 py-2">{user.apellido}</td>
                                 <td className="border border-gray-300 px-4 py-2">
                                     {user.fecha_nacimiento && formatDateOnlyEs(user.fecha_nacimiento, {
                                        day: '2-digit',
                                        month: 'long',
                                     })}
                                 </td>
                             </tr>
                        ))}
                        
                    </tbody>
                </table>
                <br />
                <h2 className="text-xl  bg-blue-100  font-semibold mb-2">🎈 Ultimos 5 cumpleaños</h2>
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Apellido</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                    {pastBirthdays.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-100  bg-blue-100 ">
                                <td className="border border-gray-300 px-4 py-2">{user.nombre}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.apellido}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {formatDateOnlyEs(user.fecha_nacimiento, {
                                        day: '2-digit',
                                        month: 'long',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// export const Usuarios = async () => {
//     // Simulación de datos de usuarios
//     const users: User[] = [
//         { nombre: 'Juan', apellido: 'Pérez', fechaNacimiento: '1990-05-01' },
//         { nombre: 'Ana', apellido: 'Gómez', fechaNacimiento: '1985-05-03' },
//         { nombre: 'Luis', apellido: 'Martínez', fechaNacimiento: '1992-05-05' },
//         { nombre: 'María', apellido: 'López', fechaNacimiento: '1995-05-07' },
//         { nombre: 'Carlos', apellido: 'Fernández', fechaNacimiento: '1988-05-09' },
//     ];

//     const today = new Date();
//     const todayString = `${today.getMonth() + 1}`.padStart(2, '0') + '-' + `${today.getDate()}`.padStart(2, '0');

//     const todayBirthdays = users.filter(user => {
//         const [year, month, day] = user.fechaNacimiento.split('-');
//         return `${month}-${day}` === todayString;
//     });

//     const upcomingBirthdays = users
//         .filter(user => {
        //     if (!user || !user.fecha_nacimiento) return false; // Validación
        //     const [year, month, day] = user.fecha_nacimiento.toString().split('-');
        //     const birthdayThisYear = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
        //     return birthdayThisYear > today;
        // })
        // .sort((a, b) => {
        //     const [aYear, aMonth, aDay] = a.fecha_nacimiento.toString().split('-');
        //     const [bYear, bMonth, bDay] = b.fecha_nacimiento.toString().split('-');
        //     const aDate = new Date(today.getFullYear(), parseInt(aMonth) - 1, parseInt(aDay));
        //     const bDate = new Date(today.getFullYear(), parseInt(bMonth) - 1, parseInt(bDay));
        //     return aDate.getTime() - bDate.getTime();
        // })
        // .slice(0, 5);

//     return {
//         props: {
//             todayBirthdays,
//             upcomingBirthdays,
//         },
//     };
// };

export default PaginaProfes;
