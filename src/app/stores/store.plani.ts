
import { Exercise, Plani, TrainingDay } from '@/types/plani';
import { create } from 'zustand'

type BloqueKey = Exclude<keyof TrainingDay, 'day'>;

type PlanillaStore = {
    planilla: Plani;
    days: number;
    setDays: (days: number) => void;
    setPlanilla: (planilla: Plani) => void;
    setStartDate: (startDate: string) => void;
    setEndDate: (endDate: string) => void;
    setUserId: (userId: string) => void; 
    setExercisesForBlock: (day: string, bloque: string, exercises: Exercise[]) => void;
    setUserEmail: (email: string) => void;
    setTrainingDays: (trainingDays: TrainingDay[]) => void;
    addNewExercise: (day: string, bloque: string, exercise: Exercise) => void;
    removeExercise: (day: string, bloque: string, exerciseIndex: number) => void;
}

const normalizeBloque = (bloque: string): BloqueKey => {
    const normalized = bloque.trim().match(/^bloque(\d)$/i);
    if (normalized) {
        return `Bloque${normalized[1]}` as BloqueKey;
    }

    return bloque as BloqueKey;
};

const usePlanilla = create<PlanillaStore>()((set, get) => ({

    //------ESTADOS -----------
    planilla: {
        month: "",
        year: "",
        userId: "",
        email: "",
        trainingDays: [],
        startDate: "",
        endDate: "",
    },
    days: 1,



    //------METODOS -----------
    setPlanilla: (planilla: Plani) => set({ planilla }),
    setDays: (days: number) => set({ days }),
    setStartDate: (startDate: string) => {
        if (!startDate) {
            set((state) => ({
                planilla: { ...state.planilla, startDate: "", month: "", year: "" }
            }));
            return;
        }

        const startDateObj = new Date(startDate + "T00:00:00");
        const rawMonth = startDateObj.toLocaleString("es-ES", { month: "long" });
        const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
        const year = startDateObj.getFullYear().toString();

        set((state) => ({
            planilla: { ...state.planilla, startDate, month, year }
        }));
    },

    setEndDate: (endDate: string) => {
        if (!endDate) {
            set((state) => ({
                planilla: { ...state.planilla, endDate: "" }
            }));
            return;
        }
        set((state) => ({
            planilla: { ...state.planilla, endDate }
        }));
    },

    setUserId: (userId: string) => set((state) => ({
        planilla: { ...state.planilla, userId }
    })),
    setExercisesForBlock: (day: string, bloque: string, exercises: Exercise[]) => {
        if (!day) return;

        set((state) => {
            const trainingDays = [...(state.planilla.trainingDays || [])];
            const existingIndex = trainingDays.findIndex((trainingDay) => trainingDay.day === day);
            const bloqueKey = normalizeBloque(bloque);

            if (existingIndex === -1) {
                trainingDays.push({
                    day,
                    [bloqueKey]: exercises,
                });
            } else {
                trainingDays[existingIndex] = {
                    ...trainingDays[existingIndex],
                    day,
                    [bloqueKey]: exercises,
                };
            }

            return {
                planilla: {
                    ...state.planilla,
                    trainingDays,
                },
            };
        });
    },
    addNewExercise: (day: string, bloque: string, exercise: Exercise) => {
    },
    removeExercise: (day: string, bloque: string, exerciseIndex: number) => {
    },
    setUserEmail: (email: string) => set((state) => ({
        planilla: { ...state.planilla, email }
    })),
    setTrainingDays: (trainingDays: TrainingDay[]) => set((state) => ({
        planilla: { ...state.planilla, trainingDays }
    })),
}))

export default usePlanilla