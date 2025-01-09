'use client'
import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function page() {
  const [value, onChange] = useState<Value>(new Date());
  
  return (
    <div className='h-screen'>
      Turnos
      <div className="flex flex-col items-center justify-center">
        <div className='flex flex-col items-center justify-center bg-slate-100 rounded-sm p-5'>
        <Calendar onChange={onChange} value={value} />
        </div>
        <div>
          <input type="date" name="" id="" value={value instanceof Date ? value.toISOString().split('T')[0] : ''} />
        </div>

      </div>
    </div>
  )
}

export default page
