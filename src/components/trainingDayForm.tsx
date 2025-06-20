'use client'
import { TrainingDay, Exercise } from '@/types/plani'
import { useState, useCallback } from 'react'
import ExerciseForm from './ExerciseForm'

import React from 'react'

interface Props {
    day: string;
    onChange: (day: string, trainingDay: TrainingDay) => void;
}

const TrainingDayForm: React.FC<Props> = ({ day, onChange }) => {
    // const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([])
    // console.log("dia: "+ day)
    const [trainingDay, setTrainingDay] = useState<TrainingDay>({
        day: day,
        Bloque1: [],
        Bloque2: [],
        Bloque3: [],
        Bloque4: []
    });

    const handleExerciseChange = useCallback((day: string, bloque: string, exercises: Exercise[]) => {
        const updatedTrainingDay = {
            ...trainingDay,
            [bloque]: exercises,
            day: day
        };
        setTrainingDay(updatedTrainingDay);
        onChange(day, updatedTrainingDay);
    }, [trainingDay, onChange]);

    return (
        <div className='flex flex-wrap justify-center'>
            <ExerciseForm
                day={day}
                bloque='Bloque1'
                onChange={handleExerciseChange}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque2'
                onChange={handleExerciseChange}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque3'
                onChange={handleExerciseChange}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque4'
                onChange={handleExerciseChange}
            />
        </div>
    )
}

export default TrainingDayForm;
