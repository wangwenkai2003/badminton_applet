"use strict";
const common_vendor = require("./common/vendor.js");
const common_request = require("./common/request.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "./uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "equiptmentCard",
  setup(__props) {
    common_vendor.ref([]);
    common_vendor.onShow(() => {
      list.value = [];
      getEquiptments();
    });
    common_vendor.ref([]);
    let isAdd = common_vendor.ref(true);
    let limit = 5;
    let currentLimit = 0;
    let data = {
      currentLimit,
      limit
    };
    let list = common_vendor.ref([]);
    const getEquiptments = () => {
      common_request.request.get("/equiptment/get", data).then(
        (res) => {
          if (res.data.code === 1) {
            if (res.data.data.length < limit) {
              isAdd.value = false;
            } else {
              data.currentLimit = data.currentLimit + 5;
            }
            list.value = [...list.value, ...res.data.data];
          } else {
            isAdd.value = false;
          }
        }
      );
    };
    const hanldeRelease = () => {
      common_vendor.index.navigateTo({
        url: "/pages/community/equiptmentRelease"
      });
    };
    const handleDetail = (item) => {
      console.log(item, "ssss");
      common_vendor.index.navigateTo({
        url: "/pages/community/equiptmentDetail?equiptment=" + encodeURIComponent(JSON.stringify(item))
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(hanldeRelease),
        b: common_vendor.p({
          type: "search",
          size: "30"
        }),
        c: common_vendor.f(common_vendor.unref(list), (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => handleDetail(item), index),
            b: item.imgs[0],
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.price),
            e: common_vendor.t(item.user.name),
            f: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5cee6c9c"], ["__file", "F:/front_end/uni-project/badminton/commpoents/equiptmentCard/equiptmentCard.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
