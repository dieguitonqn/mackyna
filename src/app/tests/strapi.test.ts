import { url } from "inspector";
import StrapiQuery from "../Tienda/lib/strapi";
import logger from "@/lib/logger";
// Importa fetch-mock para acceder a sus métodos de mock
import fetchMock from "jest-fetch-mock";

jest.mock("@/lib/logger", () => ({
  error: jest.fn(),
}));
fetchMock.enableMocks();
describe("StrapiQuery", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  process.env.STRAPI_API_URL = "http://localhost:1337/api";
  process.env.STRAPI_API_TOKEN = "test-token";
  it("should fetch data from Strapi successfully", async () => {
    const mockData = { data: "test data" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

    const StrapiQuery = require("../Tienda/lib/strapi").default;
    const data = await StrapiQuery("test-endpoint");

    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:1337/api/test-endpoint",
      expect.objectContaining({
        method: "GET",
        headers: {
          Authorization: "Bearer test-token",
        },
      })
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("should handle Strapi API errors", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: "Not Found" }), {
      status: 404,
    });
    const StrapiQuery = require("../Tienda/lib/strapi").default;
    const data = await StrapiQuery("test-endpoint");

    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching data from Strapi: Not Found"
    );
    expect(data).toBeUndefined();
  });

  // it("should handle network errors", async () => {

  //   const data = await StrapiQuery("test-endpoint");

  //   expect(logger.error).toHaveBeenCalledWith(
  //     "Error in StrapiQuery: Error: Network error"
  //   );
  //   expect(data).toBeUndefined();
  // });
});
