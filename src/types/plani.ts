export interface Exercise {
    name: string;
    reps: string;
    sets: number;
    notas: string;
    videoLink?: string;
  }
  
  export interface Plani {
    _id?: string;
    month: string;
    year: string;
    userId: string;
    email: string;
    trainingDays: TrainingDay[];
    startDate: string; // ISO String
    endDate: string; // ISO String
    createdAt?: string;
    updatedAt?: string;
  }
  export interface TrainingDay {
    day: string; // Nombre del día (e.g., "Lunes")
    Bloque1?: Exercise[];
    Bloque2?: Exercise[];
    Bloque3?: Exercise[];
    Bloque4?: Exercise[];
  }