'use client'
import { TrainingDay } from '@/types/plani'
import ExerciseForm from './ExerciseForm'

import React from 'react'

interface Props {
    day: string;
    trainingDayPlanti?: TrainingDay;
}

const TrainingDayForm: React.FC<Props> = ({ day, trainingDayPlanti }) => {
    console.log("Training Day data received in TrainingDayForm:", trainingDayPlanti);
    return (
        <div className='flex flex-wrap justify-center'>
            <ExerciseForm
                day={day}
                bloque='Bloque1'
                initialExercises={trainingDayPlanti?.Bloque1}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque2'
                initialExercises={trainingDayPlanti?.Bloque2}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque3'
                initialExercises={trainingDayPlanti?.Bloque3}
            />
            <ExerciseForm
                day={day}
                bloque='Bloque4'
                initialExercises={trainingDayPlanti?.Bloque4}
            />
        </div>
    )
}

export default TrainingDayForm;
