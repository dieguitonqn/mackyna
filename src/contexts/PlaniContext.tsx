'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Plani, TrainingDay, Exercise } from '@/types/plani';
import { IUser } from '@/types/user';
import { IPlantilla } from '@/types/plantilla';

interface PlaniContextType {
  // Estado de la planilla
  plan: Plani;
  setPlan: React.Dispatch<React.SetStateAction<Plani>>;
  
  // Usuario seleccionado
  selectedUser: IUser | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  
  // Días de entrenamiento
  days: number;
  setDays: React.Dispatch<React.SetStateAction<number>>;
  
  // Funciones de utilidad
  updateTrainingDay: (day: string, trainingDay: TrainingDay) => void;
  updateExercises: (day: string, bloque: string, exercises: Exercise[]) => void;
  selectUser: (user: IUser) => void;
  loadFromPlantilla: (plantilla: IPlantilla) => void;
  resetPlan: () => void;
}

const defaultPlan: Plani = {
  month: "",
  year: "",
  userId: "",
  email: "",
  trainingDays: [],
  startDate: "",
  endDate: "",
};

const PlaniContext = createContext<PlaniContextType | undefined>(undefined);

export const usePlaniContext = () => {
  const context = useContext(PlaniContext);
  if (!context) {
    throw new Error('usePlaniContext debe ser usado dentro de PlaniProvider');
  }
  return context;
};

interface PlaniProviderProps {
  children: ReactNode;
}

export const PlaniProvider: React.FC<PlaniProviderProps> = ({ children }) => {
  const [plan, setPlan] = useState<Plani>(defaultPlan);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [days, setDays] = useState<number>(1);

  const updateTrainingDay = (day: string, trainingDay: TrainingDay) => {
    if (day === "") {
      console.warn("Received empty day value for training change. Ignoring update.");
      return;
    }

    setPlan((prevPlan) => {
      const existingIndex = prevPlan.trainingDays.findIndex((d) => d.day === day);
      
      let updatedTrainingDays;
      if (existingIndex !== -1) {
        updatedTrainingDays = [...prevPlan.trainingDays];
        updatedTrainingDays[existingIndex] = trainingDay;
      } else {
        updatedTrainingDays = [...prevPlan.trainingDays, trainingDay];
      }

      return {
        ...prevPlan,
        trainingDays: updatedTrainingDays,
      };
    });
  };

  const updateExercises = (day: string, bloque: string, exercises: Exercise[]) => {
    setPlan((prevPlan) => {
      const existingDayIndex = prevPlan.trainingDays.findIndex((d) => d.day === day);
      
      if (existingDayIndex !== -1) {
        const updatedTrainingDays = [...prevPlan.trainingDays];
        updatedTrainingDays[existingDayIndex] = {
          ...updatedTrainingDays[existingDayIndex],
          [bloque]: exercises,
        };
        
        return {
          ...prevPlan,
          trainingDays: updatedTrainingDays,
        };
      }
      
      return prevPlan;
    });
  };

  const selectUser = (user: IUser) => {
    setSelectedUser(user);
    setPlan((prevPlan) => ({
      ...prevPlan,
      userId: user._id.toString(),
      email: user.email,
    }));
  };

  const loadFromPlantilla = (plantilla: IPlantilla) => {
    setDays(0);
    setPlan(prevPlan => ({ ...prevPlan, trainingDays: [] }));
    
    setTimeout(() => {
      setPlan(plan => ({
        ...plan,
        trainingDays: plantilla.trainingDays || [],
      }));
      setDays(plantilla.trainingDays.length);
    }, 0);
  };

  const resetPlan = () => {
    setPlan(defaultPlan);
    setSelectedUser(null);
    setDays(1);
  };

  const contextValue: PlaniContextType = {
    plan,
    setPlan,
    selectedUser,
    setSelectedUser,
    days,
    setDays,
    updateTrainingDay,
    updateExercises,
    selectUser,
    loadFromPlantilla,
    resetPlan,
  };

  return (
    <PlaniContext.Provider value={contextValue}>
      {children}
    </PlaniContext.Provider>
  );
};