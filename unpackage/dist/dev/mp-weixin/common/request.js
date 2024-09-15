"use strict";
const common_vendor = require("./vendor.js");
const common_config = require("./config.js");
let request = (url, method = "get", data = {}) => {
  return new Promise((resolve, reject) => {
    common_vendor.wx$1.request({
      url: common_config.config.APP_SERVER_URL + url,
      method,
      data,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const request$1 = {
  get(url, data) {
    return request(url, "get", data);
  },
  post(url, data) {
    return request(url, "post", data);
  },
  delete(url, data) {
    return request(url, "delete", data);
  },
  put(url, data) {
    return request(url, "put", data);
  }
};
exports.request = request$1;
