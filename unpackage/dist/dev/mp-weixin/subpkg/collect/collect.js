"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const common_request = require("../../common/request.js");
require("../../common/config.js");
const _sfc_main = {
  __name: "collect",
  setup(__props) {
    const formModel = common_vendor.ref({
      account: "",
      password: "",
      repassword: "",
      name: "",
      avatar: ""
    });
    common_vendor.ref("");
    const userStore = store_user.useUserStore();
    const { user } = userStore;
    formModel.value = user;
    common_vendor.onShow(() => {
      getAll();
    });
    let collectList = common_vendor.ref([]);
    const getAll = () => {
      common_request.request.get("/collect/getAllByAccount?userAccount=" + formModel.value.account).then(
        (res) => {
          console.log(res, "res");
          collectList.value = res.data.data;
        }
      );
    };
    const toEuiqptmentDetail = (item) => {
      common_vendor.index.navigateTo({
        url: "/pages/community/equiptmentDetail?equiptment=" + encodeURIComponent(JSON.stringify(item))
      });
    };
    const toChat = (item) => {
      common_vendor.index.navigateTo({
        url: "/subpkg/chat/chat?userAccount=" + item
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(collectList), (item, index, i0) => {
          return {
            a: item.equiptmentDto.imgs[0],
            b: common_vendor.t(item.equiptmentDto.title),
            c: common_vendor.t(item.equiptmentDto.price),
            d: item.equiptmentDto.user.avatar,
            e: common_vendor.t(item.equiptmentDto.user.name),
            f: common_vendor.o(($event) => toChat(item.equiptmentDto.user.account)),
            g: common_vendor.o(($event) => toEuiqptmentDetail(item.equiptmentDto))
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/subpkg/collect/collect.vue"]]);
wx.createPage(MiniProgramPage);
