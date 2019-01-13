import axios from "axios";

axios.defaults.baseURL = "http://localhost:4943";

/**
 * Request the roman numerals
 * for the given decimal number.
 *
 * Throws any server errors
 *
 * @param {number | string} decimal
 */
export async function toNumerals(decimal) {
  return (await axios.get(`/decimal/${decimal}`)).data.numerals;
}

/**
 * Request the decimal form of the given roman
 * numerals.
 *
 * Throws any server errors
 *
 * @param {string} numerals
 */
export async function toDecimal(numerals) {
  return (await axios.get(`/numerals/${numerals}`)).data.decimal;
}
