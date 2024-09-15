"use strict";
const common_vendor = require("../../common/vendor.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
require("../../common/config.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "reserveForm",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const { user } = userStore;
    common_vendor.ref("9:00");
    let formData = common_vendor.ref({
      endTime: "",
      ifReservation: "",
      ifUse: false,
      isReserve: "",
      reserveUserAccount: "",
      siteAddress: "",
      siteId: "",
      siteName: "",
      siteType: "",
      startTime: ""
    });
    let reserveParam = common_vendor.ref({ siteType: "", siteId: "" });
    let aviableTime = common_vendor.ref([]);
    let aviableStart = common_vendor.ref(/* @__PURE__ */ new Set());
    common_vendor.ref(aviableStart.value[0]);
    let aviableEnd = common_vendor.ref([]);
    common_vendor.onLoad((options) => {
      let dataString = decodeURIComponent(options.data);
      let reservationData = JSON.parse(dataString);
      formData.value = reservationData;
      formData.value.id = "";
      formData.value.startTime = "";
      formData.value.endTime = "";
      formData.value.reserveUserAccount = user.account;
      reserveParam.value.siteId = reservationData.siteId;
      reserveParam.value.siteType = reservationData.siteType;
      getReserTime();
    });
    const getReserTime = () => {
      common_request.request.get("/reservationSite/getReserTime", reserveParam.value).then(
        (res) => {
          aviableTime.value = res.data;
          for (let i in aviableTime.value) {
            aviableStart.value.add(aviableTime.value[i].split("-")[0]);
          }
          const aviableStartArray = Array.from(aviableStart.value);
          const objectArray = aviableStartArray.map((time) => ({
            value: time,
            text: time
          }));
          aviableStart.value = objectArray;
        }
      );
    };
    const handleStart = () => {
      let startTime = common_vendor.ref(formData.value.startTime);
      console.log(aviableTime.value);
      aviableEnd.value = [];
      for (let i in aviableTime.value) {
        let item = aviableTime.value[i].split("-")[0];
        let endItem = aviableTime.value[i].split("-")[1];
        if (item === startTime.value) {
          aviableEnd.value.push({
            value: endItem,
            text: endItem
          });
        }
      }
    };
    const submit = () => {
      console.log(formData.value, "fv");
      if (formData.value.reserveUserAccount === "") {
        common_vendor.index.showToast({
          title: "请输入预约人",
          icon: "error"
        });
        return;
      }
      if (formData.value.startTime === "") {
        common_vendor.index.showToast({
          title: "请输入开始时间",
          icon: "error"
        });
        return;
      }
      if (formData.value.endTime === "") {
        common_vendor.index.showToast({
          title: "请输入结束时间",
          icon: "error"
        });
        return;
      }
      common_request.request.post("/reservationSite/saveReservation", formData.value).then(
        (res) => {
          if (res.data.code === 1) {
            common_vendor.index.showToast({
              title: "预约成功"
            });
            setTimeout(function() {
              common_vendor.index.navigateBack({
                delta: 1
              });
            }, 2e3);
          }
        }
      );
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => common_vendor.unref(formData).reserveUserAccount = $event),
        b: common_vendor.p({
          type: "text",
          modelValue: common_vendor.unref(formData).reserveUserAccount
        }),
        c: common_vendor.p({
          label: "预约人",
          name: "account"
        }),
        d: common_vendor.o(($event) => common_vendor.unref(formData).siteName = $event),
        e: common_vendor.p({
          type: "text",
          disabled: true,
          modelValue: common_vendor.unref(formData).siteName
        }),
        f: common_vendor.p({
          label: "场地名称",
          name: "name"
        }),
        g: common_vendor.o(($event) => common_vendor.unref(formData).siteAddress = $event),
        h: common_vendor.p({
          type: "text",
          disabled: true,
          modelValue: common_vendor.unref(formData).siteAddress
        }),
        i: common_vendor.p({
          label: "场地地址",
          name: "address"
        }),
        j: common_vendor.o(handleStart),
        k: common_vendor.o(($event) => common_vendor.unref(formData).startTime = $event),
        l: common_vendor.p({
          localdata: common_vendor.unref(aviableStart),
          clear: false,
          placeholder: "开始时间",
          modelValue: common_vendor.unref(formData).startTime
        }),
        m: common_vendor.o(($event) => common_vendor.unref(formData).endTime = $event),
        n: common_vendor.p({
          localdata: common_vendor.unref(aviableEnd),
          clear: false,
          placeholder: "结束时间",
          modelValue: common_vendor.unref(formData).endTime
        }),
        o: common_vendor.o(submit),
        p: common_vendor.p({
          modelValue: common_vendor.unref(formData)
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/reservation/reserveForm.vue"]]);
wx.createPage(MiniProgramPage);
