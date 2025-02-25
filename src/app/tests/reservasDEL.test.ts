import { DELETE } from '../api/reservas/route';
import { NextResponse } from 'next/server';
import {describe, expect, test} from '@jest/globals';
import Turno from '@/lib/models/turnos';
import Reserva from '@/lib/models/reservas';
import connect from '@/lib/db';

// Mock de las dependencias
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/lib/models/turno', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock('@/lib/models/reserva', () => ({
  __esModule: true,
  default: {
    deleteOne: jest.fn(),
  },
}));

test('DELETE /api/reservas/:id', async () => {
    const req = {
        query: {
        id: '123',
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    

})