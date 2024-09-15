"use strict";
const common_vendor = require("../../common/vendor.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
require("../../common/config.js");
if (!Array) {
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  _easycom_uni_data_select2();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
if (!Math) {
  _easycom_uni_data_select();
}
const _sfc_main = {
  __name: "update-user",
  setup(__props) {
    const range = common_vendor.ref(
      [
        { value: 0, text: "男" },
        { value: 1, text: "女" },
        { value: 2, text: "保密" }
      ]
    );
    const formModel = common_vendor.ref({
      account: "",
      name: "",
      avatar: ""
    });
    common_vendor.ref("");
    const userStore = store_user.useUserStore();
    const { user } = userStore;
    formModel.value = user;
    const onSubmit = () => {
      common_request.request.put("/user/update", formModel.value).then(
        (result) => {
          if (result.data.code === 1) {
            common_vendor.index.showToast({
              title: "修改成功"
            });
          }
        }
      );
    };
    const openFileSelector = () => {
      common_vendor.index.chooseImage({
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          const fs = common_vendor.index.getFileSystemManager();
          fs.readFile({
            filePath: tempFilePaths[0],
            encoding: "base64",
            success: (data) => {
              const base64 = "data:image/png;base64," + data.data;
              formModel.value.avatar = base64;
            }
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: formModel.value.avatar,
        b: common_vendor.o(openFileSelector),
        c: common_vendor.o(openFileSelector),
        d: formModel.value.name,
        e: common_vendor.o(($event) => formModel.value.name = $event.detail.value),
        f: formModel.value.college,
        g: common_vendor.o(($event) => formModel.value.college = $event.detail.value),
        h: common_vendor.o(_ctx.change),
        i: common_vendor.o(($event) => formModel.value.sex = $event),
        j: common_vendor.p({
          localdata: range.value,
          modelValue: formModel.value.sex
        }),
        k: common_vendor.o(onSubmit)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/my/update-user.vue"]]);
wx.createPage(MiniProgramPage);
