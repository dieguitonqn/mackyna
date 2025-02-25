import { DELETE } from '../api/reservas/route';
import { NextResponse } from 'next/server';
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

describe('DELETE /api/reservas', () => {
    beforeEach(() => {
      // Limpiar todos los mocks antes de cada prueba
      jest.clearAllMocks();
    });
  
    it('debería retornar 404 si el turno no existe', async () => {
      // Mock de la respuesta de findById
      (Turno.findById as jest.Mock).mockResolvedValue(null);
  
      const req = new Request('http://localhost:3000/api/reservas', {
        method: 'DELETE',
        body: JSON.stringify({
          turnoID: '123',
          userID: '456'
        })
      });
  
      const response = await DELETE(req);
      expect(response.status).toBe(404);
      expect(await response.text()).toBe('Turno no encontrado');
    });
  
    it('no debería permitir cancelar un turno de un día anterior', async () => {
      // Mock del turno
      const mockTurno = {
        dia_semana: 'lunes',
        hora_inicio: '10:00'
      };
      (Turno.findById as jest.Mock).mockResolvedValue(mockTurno);
  
      // Simular que hoy es martes
      const mockDate = new Date('2024-02-27T10:00:00'); // Un martes
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  
      const req = new Request('http://localhost:3000/api/reservas', {
        method: 'DELETE',
        body: JSON.stringify({
          turnoID: '123',
          userID: '456'
        })
      });
  
      const response = await DELETE(req);
      expect(response.status).toBe(403);
      const responseBody = await response.json();
      expect(responseBody.mensaje).toBe('No se puede cancelar un turno de un día anterior');
    });
  
    it('debería permitir cancelar un turno futuro', async () => {
      // Mock del turno
      const mockTurno = {
        dia_semana: 'miércoles',
        hora_inicio: '10:00'
      };
      (Turno.findById as jest.Mock).mockResolvedValue(mockTurno);
      (Reserva.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
  
      // Simular que hoy es martes
      const mockDate = new Date('2024-02-27T10:00:00'); // Un martes
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  
      const req = new Request('http://localhost:3000/api/reservas', {
        method: 'DELETE',
        body: JSON.stringify({
          turnoID: '123',
          userID: '456'
        })
      });
  
      const response = await DELETE(req);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('Reserva cancelada correctamente');
    });
  });