const axios = require("axios");

const monnify = (apiKey, secretKey, baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
  });

  const getAccessToken = async () => {
    try {
      const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");
      const response = await instance.post("/api/v1/auth/login", {}, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      return response.data.responseBody.accessToken;
    } catch (error) {
      console.error("Monnify Auth Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const initializeTransaction = async (form) => {
    try {
      const token = await getAccessToken();
      const response = await instance.post("/api/v1/merchant/transactions/init-transaction", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Monnify Initialization Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const verifyTransaction = async (transactionReference) => {
    try {
      const token = await getAccessToken();
      const response = await instance.get(`/api/v1/merchant/transactions/query?transactionReference=${transactionReference}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Monnify Verification Error:", error.response?.data || error.message);
      throw error;
    }
  };

  return { initializeTransaction, verifyTransaction };
};

module.exports = monnify;
