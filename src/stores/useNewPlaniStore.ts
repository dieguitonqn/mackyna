import { create } from "zustand";
import { Plani, TrainingDay, Exercise } from "@/types/plani";
import { IUser } from "@/types/user";
import { IPlantilla, IPlantillaSId } from "@/types/plantilla";
import clientLogger from "@/lib/clientLogger";

type BloqueKey = "Bloque1" | "Bloque2" | "Bloque3" | "Bloque4";

const defaultPlan: Plani = {
  month: "",
  year: "",
  userId: "",
  email: "",
  trainingDays: [],
  startDate: "",
  endDate: "",
};

interface NewPlaniState {
  plan: Plani;
  days: number;
  selectedUser: IUser | null;
  userInfo: boolean;
  users: IUser[];
  plantillas: IPlantilla[];
  modalPlantilla: boolean;
  modalPlantillaForm: {
    name: string;
    descripcion: string;
  };
  setDays: (days: number) => void;
  setUsers: (users: IUser[]) => void;
  setPlantillas: (plantillas: IPlantilla[]) => void;
  setDateField: (field: "startDate" | "endDate", value: string) => void;
  syncMonthYearFromStartDate: () => void;
  fetchUsers: () => Promise<void>;
  fetchPlantillas: () => Promise<void>;
  selectUser: (user: IUser) => void;
  upsertTrainingDay: (day: string, trainingDay: TrainingDay) => void;
  setBlockExercises: (day: string, bloque: BloqueKey, exercises: Exercise[]) => void;
  loadPlantilla: (plantilla: IPlantilla) => void;
  submitPlanilla: () => Promise<{ ok: boolean; error?: string }>;
  saveCurrentAsPlantilla: (nombreUser: string) => Promise<{ ok: boolean; error?: string }>;
  openModalPlantilla: () => void;
  closeModalPlantilla: () => void;
  setModalPlantillaField: (field: "name" | "descripcion", value: string) => void;
}

export const useNewPlaniStore = create<NewPlaniState>((set, get) => ({
  plan: defaultPlan,
  days: 1,
  selectedUser: null,
  userInfo: false,
  users: [],
  plantillas: [],
  modalPlantilla: false,
  modalPlantillaForm: {
    name: "",
    descripcion: "",
  },

  setDays: (days) => set({ days }),
  setUsers: (users) => set({ users }),
  setPlantillas: (plantillas) => set({ plantillas }),

  setDateField: (field, value) =>
    set((state) => ({
      plan: {
        ...state.plan,
        [field]: value,
      },
    })),

  syncMonthYearFromStartDate: () => {
    const startDateValue = get().plan.startDate;
    if (!startDateValue) {
      return;
    }

    const startDate = new Date(startDateValue + "T00:00:00");
    const rawMonth = startDate.toLocaleString("es-ES", { month: "long" });
    const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    const year = startDate.getFullYear().toString();

    set((state) => ({
      plan: {
        ...state.plan,
        month,
        year,
      },
    }));
  },

  fetchUsers: async () => {
    try {
      const response = await fetch("/api/usuarios");
      const usersDB = await response.json();
      const usersWithStringId = usersDB.map((user: IUser) => ({
        ...user,
        id: user._id.toString(),
      }));

      set({ users: usersWithStringId });
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  },

  fetchPlantillas: async () => {
    try {
      const response = await fetch("/portalProfes/Plantillas/api/plantillas");
      const plantillasDB = await response.json();
      const plantillasWithStringId = plantillasDB.map((plantilla: IPlantillaSId) => ({
        ...plantilla,
        id: plantilla._id?.toString(),
      }));

      set({ plantillas: plantillasWithStringId });
    } catch (err) {
      console.error("Error al obtener plantillas:", err);
    }
  },

  selectUser: (user) =>
    set((state) => ({
      selectedUser: user,
      userInfo: true,
      plan: {
        ...state.plan,
        userId: user._id.toString(),
        email: user.email,
      },
    })),

  upsertTrainingDay: (day, trainingDay) =>
    set((state) => {
      if (!day) {
        return state;
      }

      const existingIndex = state.plan.trainingDays.findIndex((d) => d.day === day);
      const updatedTrainingDays = [...state.plan.trainingDays];

      if (existingIndex !== -1) {
        updatedTrainingDays[existingIndex] = trainingDay;
      } else {
        updatedTrainingDays.push(trainingDay);
      }

      return {
        plan: {
          ...state.plan,
          trainingDays: updatedTrainingDays,
        },
      };
    }),

  setBlockExercises: (day, bloque, exercises) =>
    set((state) => {
      const trainingDays = [...state.plan.trainingDays];
      const dayIndex = trainingDays.findIndex((d) => d.day === day);

      if (dayIndex === -1) {
        trainingDays.push({
          day,
          Bloque1: bloque === "Bloque1" ? exercises : [],
          Bloque2: bloque === "Bloque2" ? exercises : [],
          Bloque3: bloque === "Bloque3" ? exercises : [],
          Bloque4: bloque === "Bloque4" ? exercises : [],
        });
      } else {
        trainingDays[dayIndex] = {
          ...trainingDays[dayIndex],
          [bloque]: exercises,
        };
      }

      return {
        plan: {
          ...state.plan,
          trainingDays,
        },
      };
    }),

  loadPlantilla: (plantilla) =>
    set((state) => ({
      days: plantilla.trainingDays.length,
      plan: {
        ...state.plan,
        trainingDays: plantilla.trainingDays || [],
      },
    })),

  submitPlanilla: async () => {
    const { selectedUser, plan } = get();

    if (!selectedUser) {
      return { ok: false, error: "Por favor, selecciona un usuario." };
    }

    clientLogger.info("Creando planilla para el usuario: ", {
      userId: selectedUser._id,
    });
    clientLogger.debug("Datos de la planilla: ", { plan });

    try {
      const response = await fetch("/api/planillas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...plan }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la planilla");
      }

      return { ok: true };
    } catch (error) {
      clientLogger.error("Error al crear la planilla", {
        error,
        userId: selectedUser._id,
      });
      return { ok: false, error: "Error al crear la planilla" };
    }
  },

  saveCurrentAsPlantilla: async (nombreUser) => {
    const { plan, modalPlantillaForm } = get();

    const plantillaData: IPlantilla = {
      nombre: modalPlantillaForm.name,
      nombreUser,
      descripcion: modalPlantillaForm.descripcion,
      trainingDays: plan.trainingDays,
    };

    clientLogger.info("Guardando nueva plantilla: ", { plantillaData });

    try {
      const response = await fetch("/portalProfes/Plantillas/api/plantillas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantillaData),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la plantilla");
      }

      const savedPlantilla = await response.json();
      console.log("Plantilla guardada:", savedPlantilla);

      set((state) => ({
        modalPlantilla: false,
        modalPlantillaForm: {
          name: "",
          descripcion: "",
        },
        plantillas: [...state.plantillas, savedPlantilla],
      }));

      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, error: "Error al guardar la plantilla" };
    }
  },

  openModalPlantilla: () => set({ modalPlantilla: true }),

  closeModalPlantilla: () =>
    set({
      modalPlantilla: false,
      modalPlantillaForm: {
        name: "",
        descripcion: "",
      },
    }),

  setModalPlantillaField: (field, value) =>
    set((state) => ({
      modalPlantillaForm: {
        ...state.modalPlantillaForm,
        [field]: value,
      },
    })),
}));
