'use client'
import { TrainingDay, Exercise } from '@/types/plani'
import { useState, useCallback, useEffect } from 'react'
import ExerciseForm from './ExerciseForm'

import React from 'react'

interface Props {
    day: string;
    onChange: (day: string, trainingDay: TrainingDay) => void;
    initialTrainingDay?: TrainingDay;
}

const TrainingDayForm: React.FC<Props> = ({ day, onChange, initialTrainingDay }) => {
    const [trainingDay, setTrainingDay] = useState<TrainingDay>(() => {
        if (initialTrainingDay) {
            return {
                ...initialTrainingDay,
                day: day
            };
        }
        return {
            day: day,
            Bloque1: [],
            Bloque2: [],
            Bloque3: [],
            Bloque4: []
        };
    });

    // Actualizamos el estado cuando cambian las props
    useEffect(() => {
        if (initialTrainingDay) {
            setTrainingDay({
                ...initialTrainingDay,
                day: day
            });
        }
    }, [initialTrainingDay, day]);

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
                initialExercises={trainingDay.Bloque1}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque2'
                onChange={handleExerciseChange}
                initialExercises={trainingDay.Bloque2}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque3'
                onChange={handleExerciseChange}
                initialExercises={trainingDay.Bloque3}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque4'
                onChange={handleExerciseChange}
                initialExercises={trainingDay.Bloque4}
            />
        </div>
    )
}

export default TrainingDayForm;
