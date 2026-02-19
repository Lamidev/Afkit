const axios = require("axios");

const paystack = (secretKey) => {
  const instance = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  const initializePayment = async (form) => {
    try {
      const response = await instance.post("/transaction/initialize", form);
      return response.data;
    } catch (error) {
      console.error("Paystack Initialization Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const verifyPayment = async (reference) => {
    try {
      const response = await instance.get(`/transaction/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error("Paystack Verification Error:", error.response?.data || error.message);
      throw error;
    }
  };

  return { initializePayment, verifyPayment };
};

module.exports = paystack;
