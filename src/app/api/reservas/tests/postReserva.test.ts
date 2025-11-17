import { POST } from '../route';
import { createRequest, createResponse } from 'node-mocks-http';

describe('POST /api/reservas', () => {
  it('debería crear una reserva correctamente', async () => {
    const req = createRequest({
      method: 'POST',
      body: {
        userID: 'ID_DE_USUARIO_VALIDO',
        turnoID: 'ID_DE_TURNO_VALIDO',
        individual: false
      }
    });
    // Simula el método .json() de Request
    req.json = async () => req.body;
    const res = await POST(req);
    expect(res.status).toBe(200);
    // Puedes agregar más validaciones según la respuesta esperada
  });

  it('debería devolver error si el usuario no existe', async () => {
    const req = createRequest({
      method: 'POST',
      body: {
        userID: 'ID_NO_EXISTENTE',
        turnoID: 'ID_DE_TURNO_VALIDO',
        individual: false
      }
    });
    req.json = async () => req.body;
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  // Puedes agregar más tests para otros casos de error
});
