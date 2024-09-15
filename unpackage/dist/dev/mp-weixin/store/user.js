"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore(
  "big-user",
  () => {
    const token = common_vendor.ref("");
    const setToken = (t) => token.value = t;
    const removeToken = () => {
      token.value = "";
    };
    const user = common_vendor.ref({});
    const setUser = (obj) => {
      console.log(obj, "obj");
      user.value = obj;
    };
    const getUser = async () => {
    };
    return { token, setToken, removeToken, setUser, getUser, user };
  },
  {
    persist: true
  }
);
exports.useUserStore = useUserStore;
