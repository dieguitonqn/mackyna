import { ObjectId } from 'mongodb';

const connectMock = jest.fn();
const userFindOneMock = jest.fn();
const reservaFindMock = jest.fn();
const reservaFindOneMock = jest.fn();
const reservaDeleteManyMock = jest.fn();
const reservaCountDocumentsMock = jest.fn();
const turnoFindByIdMock = jest.fn();
const turnoFindByIdAndUpdateMock = jest.fn();
const saveMock = jest.fn();

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: connectMock,
}));

jest.mock('@/lib/models/user', () => ({
  __esModule: true,
  default: {
    findOne: (...args: unknown[]) => userFindOneMock(...args),
  },
}));

jest.mock('@/lib/models/reservas', () => {
  const ReservaMock = jest.fn().mockImplementation(() => ({
    save: saveMock,
  }));

  ReservaMock.find = (...args: unknown[]) => reservaFindMock(...args);
  ReservaMock.findOne = (...args: unknown[]) => reservaFindOneMock(...args);
  ReservaMock.deleteMany = (...args: unknown[]) => reservaDeleteManyMock(...args);
  ReservaMock.countDocuments = (...args: unknown[]) => reservaCountDocumentsMock(...args);

  return {
    __esModule: true,
    default: ReservaMock,
  };
});

jest.mock('@/lib/models/turnos', () => ({
  __esModule: true,
  default: {
    findById: (...args: unknown[]) => turnoFindByIdMock(...args),
    findByIdAndUpdate: (...args: unknown[]) => turnoFindByIdAndUpdateMock(...args),
  },
}));

jest.mock('@/lib/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const createRequest = (body: Record<string, unknown>) => {
  const req = new Request('http://localhost/api/reservas', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return req;
};

describe('POST /api/reservas', () => {
  const userID = new ObjectId().toString();
  const turnoID = new ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
    connectMock.mockResolvedValue(undefined);
    reservaFindMock.mockResolvedValue([]);
    reservaFindOneMock.mockResolvedValue(null);
    reservaDeleteManyMock.mockResolvedValue({ deletedCount: 0 });
    reservaCountDocumentsMock.mockResolvedValue(0);
    turnoFindByIdMock.mockResolvedValue({
      _id: turnoID,
      dia_semana: 'Lunes',
      hora_inicio: '08:00',
      hora_fin: '09:00',
      cupos_disponibles: 5,
    });
    turnoFindByIdAndUpdateMock.mockResolvedValue({});
    saveMock.mockResolvedValue(undefined);
  });

  it('debería crear una reserva correctamente', async () => {
    const { POST } = await import('../route');
    userFindOneMock.mockResolvedValue({
      _id: userID,
      nombre: 'Diego',
      apellido: 'Perez',
      habilitado: true,
      dias_permitidos: 3,
    });

    const req = createRequest({
      userID,
      turnoID,
      individual: false,
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(turnoFindByIdAndUpdateMock).toHaveBeenCalledWith(turnoID, {
      $inc: { cupos_disponibles: -1 },
    });
  });

  it('debería devolver error si el usuario no existe', async () => {
    const { POST } = await import('../route');
    userFindOneMock.mockResolvedValue(null);

    const req = createRequest({
      userID,
      turnoID,
      individual: false,
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });
});
