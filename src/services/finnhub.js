import axios from "axios";

const BASE_URL = "https://finnhub.io/api/v1";
const TOKEN = "btusaun48v6q7nvm0nk0";
const EXCHANGE = "US";

export const getSymbols = async () => {
  try {
    const { status, data } = await axios.get(
      `${BASE_URL}/stock/symbol?exchange=${EXCHANGE}&token=${TOKEN}`,
    );

    if (status === 200) return data;

    return [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("ERROR: Unable to retrieve symbol data from finnhub", e);
  }
  return [];
};

export const getPrices = async (startDate, endDate, symbols) => {
  try {
    const [...response] = await Promise.all(
      symbols.map(async (s) =>
        axios.get(
          `${BASE_URL}/stock/candle?symbol=${s}&resolution=D&from=${startDate.format(
            "X",
          )}&to=${endDate.format("X")}&token=${TOKEN}`,
        ),
      ),
    );

    if (response.every(({ status }) => status === 200)) {
      return symbols.reduce(
        (prices, s, index) => ({
          ...prices,
          [s]: response[index].data,
        }),
        {},
      );
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      `ERROR: Unable to retrieve price data from finnhub for symbols: ${symbols.join(
        ",",
      )} `,
      e,
    );
  }

  return {};
};
