'use client'
import { TrainingDay } from '@/types/plani'
import ExerciseForm from './ExerciseForm'

import React from 'react'

interface Props {
    day: string;
    trainingDayPlanti?: TrainingDay;
}

const TrainingDayForm: React.FC<Props> = ({ day, trainingDayPlanti }) => {

    return (
        <div className='flex flex-wrap justify-center'>
            <ExerciseForm
                day={day}
                bloque='Bloque1'
                initialExercises={trainingDayPlanti?.Bloque1}
                useStore
            />
            <ExerciseForm
                day={day}
                bloque='Bloque2'
                initialExercises={trainingDayPlanti?.Bloque2}
                useStore
            />
            <ExerciseForm
                day={day}
                bloque='Bloque3'
                initialExercises={trainingDayPlanti?.Bloque3}
                useStore
            />
            <ExerciseForm
                day={day}
                bloque='Bloque4'
                initialExercises={trainingDayPlanti?.Bloque4}
                useStore
            />
        </div>
    )
}

export default TrainingDayForm;
