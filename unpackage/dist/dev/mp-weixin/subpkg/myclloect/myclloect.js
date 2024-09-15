"use strict";
const common_vendor = require("../../common/vendor.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
require("../../common/config.js");
if (!Array) {
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  _easycom_uni_card2();
}
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  _easycom_uni_card();
}
const _sfc_main = {
  __name: "myclloect",
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
      getbyAccount();
    });
    let Reservations = common_vendor.ref([]);
    const getbyAccount = () => {
      common_request.request.get("/reservationSite/getByAccount?userAccount=" + formModel.value.account).then(
        (res) => {
          Reservations.value = res.data.data;
        }
      );
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(Reservations), (item, index, i0) => {
          return common_vendor.e({
            a: item.ifUse
          }, item.ifUse ? {} : {}, {
            b: item.status === "未使用"
          }, item.status === "未使用" ? {
            c: common_vendor.t(item.status)
          } : {}, {
            d: item.status === "使用中"
          }, item.status === "使用中" ? {
            e: common_vendor.t(item.status)
          } : {}, {
            f: item.status === "已过期"
          }, item.status === "已过期" ? {
            g: common_vendor.t(item.status)
          } : {}, {
            h: common_vendor.t(item.startTime),
            i: common_vendor.t(item.endTime),
            j: "3d4cbc6d-0-" + i0,
            k: common_vendor.p({
              title: item.siteName,
              ["sub-title"]: _ctx.subTitle,
              extra: item.siteAddress
            }),
            l: index
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/subpkg/myclloect/myclloect.vue"]]);
wx.createPage(MiniProgramPage);
