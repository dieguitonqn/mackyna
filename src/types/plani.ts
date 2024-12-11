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
    Bloque1: Exercise[];
    Bloque2: Exercise[];
    Bloque3: Exercise[];
    Bloque4: Exercise[];
    startDate: string; // ISO String
    endDate: string; // ISO String
    createdAt?: string;
    updatedAt?: string;
  }
  