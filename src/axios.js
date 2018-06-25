const axios = require("axios");

exports.axios = axios.create({
  baseURL: "https://api.stackexchange.com/2.2"
});
