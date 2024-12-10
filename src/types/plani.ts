export interface Exercise {
    name: string;
    reps: number;
    sets: number;
    videoLink?: string;
  }
  
  export interface Plani {
    _id?: string;
    month: string;
    year: string;
    userId: string;
    email: string;
    bloque1: Exercise[];
    bloque2: Exercise[];
    bloque3: Exercise[];
    bloque4: Exercise[];
    startDate: string; // ISO String
    endDate: string; // ISO String
    createdAt?: string;
    updatedAt?: string;
  }
  