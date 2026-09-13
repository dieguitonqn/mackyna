import { Plani, TrainingDay } from '@/types/plani';

export const updatePlanillaNote = (
  planilla: Plani,
  dayIndex: number,
  bloque: string,
  exerciseIndex: number,
  notas: string
): Plani => {
  const bloqueKey = bloque as keyof TrainingDay;

  return {
    ...planilla,
    trainingDays: planilla.trainingDays.map((trainingDay, currentDayIndex) => {
      if (currentDayIndex !== dayIndex) {
        return trainingDay;
      }

      const exercises = trainingDay[bloqueKey];

      if (!Array.isArray(exercises)) {
        return trainingDay;
      }

      return {
        ...trainingDay,
        [bloqueKey]: exercises.map((exercise, currentExerciseIndex) => {
          if (currentExerciseIndex !== exerciseIndex) {
            return exercise;
          }

          return {
            ...exercise,
            notas,
          };
        }),
      };
    }),
  };
};