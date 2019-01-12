import * as romegen from "./romegen";
import axios from "axios";

jest.mock("axios");

describe("romegen", () => {
  describe("toNumerals", () => {
    it("should call the api endpoint with the given decimal and return result", async () => {
      axios.get.mockImplementationOnce(async () => {
        return { data: { numerals: "MI" } };
      });
      expect(await romegen.toNumerals(1001)).toBe("MI");
      expect(axios.get).toHaveBeenCalledWith("/decimal/1001");

      axios.get.mockImplementationOnce(async () => {
        return { data: { numerals: "CD" } };
      });

      expect(await romegen.toNumerals(400)).toBe("CD");
      expect(axios.get).toHaveBeenCalledWith("/decimal/400");
    });
  });

  describe("toDecimal", () => {
    it("should call the api endpoint with the given numerals and return result", async () => {
      axios.get.mockImplementationOnce(async () => {
        return { data: { decimal: 2939 } };
      });
      expect(await romegen.toDecimal("MMCMXXXIX")).toBe(2939);
      expect(axios.get).toHaveBeenCalledWith("/numerals/MMCMXXXIX");

      axios.get.mockImplementationOnce(async () => {
        return { data: { decimal: 400 } };
      });

      expect(await romegen.toDecimal("CD")).toBe(400);
      expect(axios.get).toHaveBeenCalledWith("/numerals/CD");
    });
  });
});
