'use client'
import React, { useState, useEffect } from 'react'
import { IUser } from '@/types/user'

interface userPagos {
    _id: string;
    nombre?: string;
    apellido?: string;
    email: string;
    rol: string;
}

export const FormPagos = ({user}: {user: userPagos[]}) => {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [users, setUsers] = useState<userPagos[]>([])

    useEffect(() => {
        setUsers(user)
        console.log(user);
    }, [user])

    const handleSelect = (user: IUser) => {
        setSelectedUser(user)
    }

    return (
        <div>
            
            {/* <AutoCompleteInput users={users} onSelect={handleSelect} /> */}
            {selectedUser && (
                <div>
                    <h2>{selectedUser.nombre}</h2>
                    <p>{selectedUser.email}</p>
                </div>
            )}
        </div>
    )
}
