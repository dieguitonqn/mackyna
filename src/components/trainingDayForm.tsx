'use client'
import { TrainingDay, Exercise } from '@/types/plani'
import { useState, useCallback, useEffect } from 'react'
import ExerciseForm from './ExerciseForm'

import React from 'react'

interface Props {
    day: string;
    onChange: (day: string, trainingDay: TrainingDay) => void;
    trainingDayPlanti?: TrainingDay;
}

const TrainingDayForm: React.FC<Props> = ({ day, trainingDayPlanti,onChange }) => {
        
    // Inicializa el estado con los valores por defecto
    const [trainingDay, setTrainingDay] = useState<TrainingDay>({
        day: day,
        Bloque1: [],
        Bloque2: [],
        Bloque3: [],
        Bloque4: []
    });

    // CRÍTICO: Este useEffect sincroniza el estado interno con las props
    useEffect(() => {
        // Si recibimos datos de una plantilla, actualizamos el estado interno.
        if (trainingDayPlanti) {
            console.log(`Syncing state for ${day} with`, trainingDayPlanti);
            setTrainingDay(trainingDayPlanti);
        }
    }, [trainingDayPlanti]); // Se ejecuta CADA VEZ que trainingDayPlanti cambia


    const handleExerciseChange = useCallback((day: string, bloque: string, exercises: Exercise[]) => {
        const updatedTrainingDay = {
            ...trainingDay,
            [bloque]: exercises,
            day: day
        };
        setTrainingDay(updatedTrainingDay);
        onChange(day, updatedTrainingDay);
        console.log("updatedTrainingDay: ", updatedTrainingDay);
    }, [trainingDay, onChange]);

    return (
        <div className='flex flex-wrap justify-center'>
            <ExerciseForm
                day={day}
                bloque='Bloque1'
                onChange={handleExerciseChange}
                initialExercises={trainingDayPlanti?.Bloque1}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque2'
                onChange={handleExerciseChange}
                initialExercises={trainingDayPlanti?.Bloque2}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque3'
                onChange={handleExerciseChange}
                initialExercises={trainingDayPlanti?.Bloque3}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque4'
                onChange={handleExerciseChange}
                initialExercises={trainingDayPlanti?.Bloque4}
            />
        </div>
    )
}

export default TrainingDayForm;
