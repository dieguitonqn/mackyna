// jest.setup.ts
import fetchMock from 'jest-fetch-mock';

// Habilita los mocks de fetch antes de que cualquier test se ejecute
fetchMock.enableMocks();

if (typeof Response !== 'undefined' && typeof Response.json !== 'function') {
	Object.defineProperty(Response, 'json', {
		configurable: true,
		value: (body: unknown, init?: ResponseInit) =>
			new Response(JSON.stringify(body), {
				...init,
				headers: {
					'Content-Type': 'application/json',
					...(init?.headers || {}),
				},
			}),
	});
}

// Opcional: Define los tipos globales para fetch si no se infieren correctamente
// declare global {
//   var fetch: jest.Mock<typeof global.fetch>;
// }
// Esto es útil si TypeScript se queja de que `fetch` no es un mock.
// jest-fetch-mock ya debería extender los tipos de Jest para fetch, pero si hay problemas, puedes usar esto.