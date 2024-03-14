const axios = require("axios");

const WOO_WP_API_URI = process.env.WOO_WP_API_URI;
const WOO_WP_API_AUTH = process.env.WOO_WP_API_AUTH;

const WOO_WP_API_URI_ADMIN = process.env.WOO_WP_API_URI_ADMIN;
const WOO_WP_API_AUTH_ADMIN = process.env.WOO_WP_API_AUTH_ADMIN;

const sendTxData = async (txData, endPoint) => {
  try {
    const axiosConfig = {
      method: "post",
      url: `${WOO_WP_API_URI}${endPoint}`,
      headers: {
        authorization: WOO_WP_API_AUTH
      },
      data: txData
    };

    const res = await axios(axiosConfig);

    if (res.status !== 200 || res.data.success !== true) {
      throw Error("api call failed");
    }

    console.log("api result: ", res.data);
  } catch (err) {
    console.log("Error while calling api, error:", err);
  }

  return true;
};
const sendTxDataToAdmin = async (txData, endPoint) => {
  try {
    const axiosConfig = {
      method: "post",
      url: `${WOO_WP_API_URI_ADMIN}${endPoint}`,
      headers: {
        authorization: WOO_WP_API_AUTH_ADMIN
      },
      data: txData
    };

    const res = await axios(axiosConfig);

    if (res.status !== 200 || res.data.success !== true) {
      throw Error("api call failed");
    }

    console.log("api result: ", res.data);
  } catch (err) {
    console.log("Error while calling api, error:", err);
  }

  return true;
};

module.exports = {
  sendTxData,
  sendTxDataToAdmin
};
