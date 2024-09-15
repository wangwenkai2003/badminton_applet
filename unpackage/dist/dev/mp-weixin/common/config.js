"use strict";
let BASE_URL = "192.168.0.105:2003";
let WS_SERVER_URL = "ws://" + BASE_URL;
let APP_SERVER_URL = "http://" + BASE_URL;
const config = {
  APP_SERVER_URL,
  WS_SERVER_URL
};
exports.config = config;
