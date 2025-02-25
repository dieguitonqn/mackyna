import { DELETE } from './route';
import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Turno from '@/lib/models/turnos';
import Reserva from '@/lib/models/reservas';

jest.mock('@/lib/db');
jest.mock('@/lib/models/turnos');
jest.mock('@/lib/models/reservas');

describe('DELETE /api/reservas', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if turno not found', async () => {
        (Turno.findById as jest.Mock).mockResolvedValue(null);

        const req = {
            json: jest.fn().mockResolvedValue({ turnoID: '123', userID: '456' })
        } as unknown as Request;

        const response = await DELETE(req);

        expect(response.status).toBe(404);
        expect(await response.text()).toBe('Turno no encontrado');
    });

    it('should return 404 if reserva not found', async () => {
        (Turno.findById as jest.Mock).mockResolvedValue({ dia_semana: 'viernes', hora_inicio: '21:00' });
        (Reserva.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

        const req = {
            json: jest.fn().mockResolvedValue({ turnoID: '123', userID: '456' })
        } as unknown as Request;

        const response = await DELETE(req);

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ mensaje: 'Reserva no encontrada' });
    });

    it('should return 403 if trying to cancel a turno from a previous day', async () => {
        (Turno.findById as jest.Mock).mockResolvedValue({ dia_semana: 'jueves', hora_inicio: '10:00' });

        const req = {
            json: jest.fn().mockResolvedValue({ turnoID: '123', userID: '456' })
        } as unknown as Request;

        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2023-10-06T10:00:00Z').valueOf());

        const response = await DELETE(req);

        expect(response.status).toBe(403);
        expect(await response.json()).toEqual({ mensaje: 'No se puede cancelar un turno de un día anterior' });
    });

    it('should return 403 if trying to cancel less than 10 minutes before the turno', async () => {
        (Turno.findById as jest.Mock).mockResolvedValue({ dia_semana: 'viernes', hora_inicio: '10:00' });

        const req = {
            json: jest.fn().mockResolvedValue({ turnoID: '123', userID: '456' })
        } as unknown as Request;

        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2023-10-06T09:51:00Z').valueOf());

        const response = await DELETE(req);

        expect(response.status).toBe(403);
        expect(await response.json()).toEqual({ mensaje: 'No se puede cancelar menos de 10 min antes del turno' });
    });

    it('should return 200 if reserva is cancelled successfully', async () => {
        (Turno.findById as jest.Mock).mockResolvedValue({ dia_semana: 'viernes', hora_inicio: '21:00' });
        (Reserva.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
        (Turno.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

        const req = {
            json: jest.fn().mockResolvedValue({ turnoID: '123', userID: '456' })
        } as unknown as Request;

        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2023-10-06T21:01:00Z').valueOf());

        const response = await DELETE(req);

        expect(response.status).toBe(200);
        expect(await response.text()).toBe('Reserva cancelada correctamente');
    });

    it('should return 500 if there is an error during the process', async () => {
        (Turno.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

        const req = {
            json: jest.fn().mockResolvedValue({ turnoID: '123', userID: '456' })
        } as unknown as Request;

        const response = await DELETE(req);

        expect(response.status).toBe(500);
        expect(await response.text()).toBe('Error al cancelar la reserva: Error: Database error');
    });
});
