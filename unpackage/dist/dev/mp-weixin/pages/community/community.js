"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
if (!Math) {
  (myDynamicsCard + followCard + equipmentCard)();
}
const myDynamicsCard = () => "../../commpoents/myDynamicsCard/myDynamicsCard2.js";
const followCard = () => "../../commpoents/followCard/followCard.js";
const equipmentCard = () => "../../commpoents/equiptmentCard/equiptmentCard2.js";
const _sfc_main = {
  __name: "community",
  setup(__props) {
    let acitiveIndex = common_vendor.ref(1);
    common_vendor.onShow(
      () => {
        const userStore = store_user.useUserStore();
        const { token } = userStore;
        if (token === "") {
          console.log("未登录");
          common_vendor.index.navigateTo({
            url: "/pages/my/my-login"
          });
        }
      }
    );
    const followDynamics = () => {
      acitiveIndex.value = 0;
    };
    const myDynamics = () => {
      acitiveIndex.value = 1;
    };
    const equipmentMarket = () => {
      acitiveIndex.value = 2;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(acitiveIndex) === 0 ? 1 : "",
        b: common_vendor.o(followDynamics),
        c: common_vendor.unref(acitiveIndex) === 1 ? 1 : "",
        d: common_vendor.o(myDynamics),
        e: common_vendor.unref(acitiveIndex) === 2 ? 1 : "",
        f: common_vendor.o(equipmentMarket),
        g: common_vendor.unref(acitiveIndex) === 1,
        h: common_vendor.unref(acitiveIndex) === 0,
        i: common_vendor.unref(acitiveIndex) === 2
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/community/community.vue"]]);
wx.createPage(MiniProgramPage);
