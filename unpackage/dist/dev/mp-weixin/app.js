"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/community/community.js";
  "./pages/reservation/reservation.js";
  "./pages/my/my.js";
  "./pages/my/my-login.js";
  "./pages/my/update-user.js";
  "./commpoents/myDynamicsCard/myDynamicsCard.js";
  "./pages/follow/UserFollow.js";
  "./pages/message/message.js";
  "./pages/reservation/reserveForm.js";
  "./commpoents/equiptmentCard/equiptmentCard.js";
  "./pages/community/equiptmentRelease.js";
  "./pages/community/equiptmentDetail.js";
  "./subpkg/chat/chat.js";
  "./subpkg/userDeatil/userDeatil.js";
  "./subpkg/collect/collect.js";
  "./subpkg/myclloect/myclloect.js";
}
const _sfc_main = {
  data() {
    return {
      currentTab: 0
    };
  },
  methods: {
    redirectToHome(e) {
      const { index } = e.currentTarget.dataset;
      console.log("xx");
      if (index === 2) {
        console.log("点击首页");
        common_vendor.index.switchTab({
          url: "/pages/home/home"
        });
      }
    }
  },
  onTabSwitch(e) {
    this.currentTab = e.index;
  }
};
if (!Array) {
  const _component_tabbar_item = common_vendor.resolveComponent("tabbar-item");
  const _component_tabbar = common_vendor.resolveComponent("tabbar");
  (_component_tabbar_item + _component_tabbar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      index: "0"
    }),
    b: common_vendor.p({
      index: "1"
    }),
    c: common_vendor.p({
      index: "2"
    }),
    d: common_vendor.o($options.redirectToHome),
    e: common_vendor.p({
      current: $data.currentTab
    })
  };
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/front_end/uni-project/badminton/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(common_vendor.createPinia());
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
