// jest.setup.ts
import fetchMock from 'jest-fetch-mock';

// Habilita los mocks de fetch antes de que cualquier test se ejecute
fetchMock.enableMocks();

// Opcional: Define los tipos globales para fetch si no se infieren correctamente
// declare global {
//   var fetch: jest.Mock<typeof global.fetch>;
// }
// Esto es útil si TypeScript se queja de que `fetch` no es un mock.
// jest-fetch-mock ya debería extender los tipos de Jest para fetch, pero si hay problemas, puedes usar esto.