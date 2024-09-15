"use strict";
const common_vendor = require("../../common/vendor.js");
const common_request = require("../../common/request.js");
require("../../common/config.js");
if (!Array) {
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_data_select2 + _easycom_uni_card2)();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_data_select + _easycom_uni_card)();
}
const _sfc_main = {
  __name: "reservation",
  setup(__props) {
    const campus = common_vendor.ref([
      { value: 0, text: "东校区" },
      { value: 1, text: "西校区" },
      { value: 2, text: "武汉校区" }
    ]);
    let currentSite = common_vendor.ref(0);
    let subTitle = common_vendor.ref("东校区");
    common_vendor.onShow(() => {
      getBySiteType(currentSite.value);
    });
    let ReservationS = common_vendor.ref([]);
    const getBySiteType = (siteType) => {
      common_request.request.get("/site/getSiteAppoint?siteType=" + siteType).then(
        (res) => {
          console.log(res.data.data, "ress");
          ReservationS.value = res.data.data;
        }
      );
    };
    const changeSiteType = () => {
      getBySiteType(currentSite.value);
      let item = campus.value.find((item2) => item2.value === currentSite.value);
      console.log(item.text);
      subTitle.value = item.text;
    };
    const gotoReserve = (item) => {
      let queryString = encodeURIComponent(JSON.stringify(item));
      common_vendor.index.navigateTo({
        url: "/pages/reservation/reserveForm?data=" + queryString
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(changeSiteType),
        b: common_vendor.o(($event) => common_vendor.isRef(currentSite) ? currentSite.value = $event : currentSite = $event),
        c: common_vendor.p({
          localdata: campus.value,
          clear: false,
          placeholder: "选择校区",
          modelValue: common_vendor.unref(currentSite)
        }),
        d: common_vendor.f(common_vendor.unref(ReservationS), (item, index, i0) => {
          return common_vendor.e({
            a: item.ifUse
          }, item.ifUse ? {} : {}, {
            b: !item.ifUse
          }, !item.ifUse ? {} : {}, {
            c: item.ifUse
          }, item.ifUse ? {
            d: common_vendor.t(item.endTime)
          } : {}, {
            e: common_vendor.o(($event) => gotoReserve(item), index),
            f: "47fbf76a-1-" + i0,
            g: common_vendor.p({
              title: item.siteName,
              ["sub-title"]: common_vendor.unref(subTitle),
              extra: item.siteAddress
            }),
            h: index
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/reservation/reservation.vue"]]);
wx.createPage(MiniProgramPage);
