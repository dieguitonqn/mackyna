import { updatePlanillaNote } from './planillas.utils';
import { Plani } from '@/types/plani';

describe('updatePlanillaNote', () => {
  const basePlanilla: Plani = {
    _id: 'plani-1',
    month: 'Mayo',
    year: '2026',
    userId: 'user-1',
    email: 'test@example.com',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    trainingDays: [
      {
        day: 'Día 1',
        Bloque1: [
          { name: 'Sentadilla', reps: '10', sets: 3, notas: '', videoLink: '' },
          { name: 'Peso muerto', reps: '8', sets: 4, notas: 'vieja', videoLink: '' },
        ],
      },
      {
        day: 'Día 2',
        Bloque2: [
          { name: 'Press banca', reps: '12', sets: 3, notas: '', videoLink: '' },
        ],
      },
    ],
  };

  it('actualiza una nota de forma inmutable en el ejercicio correcto', () => {
    const updated = updatePlanillaNote(basePlanilla, 0, 'Bloque1', 1, 'nueva nota');

    expect(updated).not.toBe(basePlanilla);
    expect(updated.trainingDays).not.toBe(basePlanilla.trainingDays);
    expect(updated.trainingDays[0]).not.toBe(basePlanilla.trainingDays[0]);
    expect(updated.trainingDays[0].Bloque1?.[1].notas).toBe('nueva nota');
    expect(updated.trainingDays[0].Bloque1?.[0].notas).toBe('');
    expect(basePlanilla.trainingDays[0].Bloque1?.[1].notas).toBe('vieja');
  });

  it('no rompe la planilla si el bloque no existe', () => {
    const updated = updatePlanillaNote(basePlanilla, 0, 'Bloque3', 0, 'nota');

    expect(updated).toEqual(basePlanilla);
  });
});