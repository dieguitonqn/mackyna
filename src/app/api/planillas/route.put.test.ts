import { ObjectId } from 'mongodb';

const connectMock = jest.fn();
const findByIdAndUpdateMock = jest.fn();
const updateOneMock = jest.fn();
const findByIdMock = jest.fn();
const sessionMock = jest.fn();

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: connectMock,
}));

jest.mock('@/lib/models/planillas', () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: (...args: unknown[]) => findByIdAndUpdateMock(...args),
    updateOne: (...args: unknown[]) => updateOneMock(...args),
    findById: (...args: unknown[]) => findByIdMock(...args),
  },
}));

jest.mock('@/lib/models/user', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => sessionMock(...args),
}));

jest.mock('@/lib/auth0', () => ({
  authOptions: {},
}));

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
  planillaNotasLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('PUT /api/planillas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionMock.mockResolvedValue({ user: { email: 'test@example.com' } });
    findByIdAndUpdateMock.mockResolvedValue({ _id: new ObjectId() });
    updateOneMock.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
    });
    findByIdMock.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          trainingDays: [
            {
              Bloque1: [
                { notas: '' },
                { notas: 'nota actualizada' },
              ],
            },
          ],
        }),
      }),
    });
  });

  it('actualiza únicamente la nota de un ejercicio', async () => {
    const { PUT } = await import('./route');
    const id = '507f1f77bcf86cd799439011';
    const req = new Request('http://localhost/api/planillas', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        noteUpdate: {
          dayIndex: 0,
          bloque: 'Bloque1',
          exerciseIndex: 1,
          notas: 'nota actualizada',
        },
      }),
    });

    const res = await PUT(req);

    expect(res.status).toBe(200);
    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(updateOneMock).toHaveBeenCalledWith(
      expect.any(ObjectId),
      { $set: { 'trainingDays.0.Bloque1.1.notas': 'nota actualizada' } },
      { runValidators: true }
    );
    expect(findByIdMock).toHaveBeenCalledWith(expect.any(ObjectId));
  });

  it('rechaza ids inválidos', async () => {
    const { PUT } = await import('./route');
    const req = new Request('http://localhost/api/planillas', {
      method: 'PUT',
      body: JSON.stringify({
        id: 'id-invalido',
        noteUpdate: {
          dayIndex: 0,
          bloque: 'Bloque1',
          exerciseIndex: 0,
          notas: 'nota',
        },
      }),
    });

    const res = await PUT(req);

    expect(res.status).toBe(400);
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('rechaza llamadas sin sesión', async () => {
    sessionMock.mockResolvedValueOnce(null);
    const { PUT } = await import('./route');
    const req = new Request('http://localhost/api/planillas', {
      method: 'PUT',
      body: JSON.stringify({
        id: '507f1f77bcf86cd799439011',
        noteUpdate: {
          dayIndex: 0,
          bloque: 'Bloque1',
          exerciseIndex: 0,
          notas: 'nota',
        },
      }),
    });

    const res = await PUT(req);

    expect(res.status).toBe(401);
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('falla si la verificación posterior no coincide con la nota guardada', async () => {
    findByIdMock.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          trainingDays: [
            {
              Bloque1: [
                { notas: 'otra nota' },
              ],
            },
          ],
        }),
      }),
    });

    const { PUT } = await import('./route');
    const req = new Request('http://localhost/api/planillas', {
      method: 'PUT',
      body: JSON.stringify({
        id: '507f1f77bcf86cd799439011',
        noteUpdate: {
          dayIndex: 0,
          bloque: 'Bloque1',
          exerciseIndex: 0,
          notas: 'nota esperada',
        },
      }),
    });

    const res = await PUT(req);

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({
      message: 'La nota no pudo verificarse luego del guardado',
    });
  });

  it('rechaza bloques inválidos en noteUpdate', async () => {
    const { PUT } = await import('./route');
    const req = new Request('http://localhost/api/planillas', {
      method: 'PUT',
      body: JSON.stringify({
        id: '507f1f77bcf86cd799439011',
        noteUpdate: {
          dayIndex: 0,
          bloque: 'Bloque99',
          exerciseIndex: 0,
          notas: 'nota',
        },
      }),
    });

    const res = await PUT(req);

    expect(res.status).toBe(400);
    expect(updateOneMock).not.toHaveBeenCalled();
  });
});