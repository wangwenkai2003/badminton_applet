"use strict";
const common_vendor = require("../../common/vendor.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
const common_addImg = require("../../common/addImg.js");
require("../../common/config.js");
const _sfc_main = {
  __name: "equiptmentRelease",
  setup(__props) {
    common_vendor.index.setNavigationBarTitle({ title: "发布装备" });
    const formModel = common_vendor.ref({
      account: "",
      password: "",
      repassword: "",
      name: "",
      avatar: ""
    });
    const userStore = store_user.useUserStore();
    const { user } = userStore;
    formModel.value = user;
    console.log(user);
    let randomId = common_vendor.ref("");
    randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
    let form = common_vendor.ref({
      title: "",
      price: "",
      descContent: "",
      userAccount: formModel.value.account,
      imgId: ""
    });
    const openFileSelector = (index) => {
      if (index === imgList.value.length - 1) {
        common_vendor.index.chooseImage({
          success: (res) => {
            const tempFilePaths = res.tempFilePaths;
            const fs = common_vendor.index.getFileSystemManager();
            fs.readFile({
              filePath: tempFilePaths[0],
              encoding: "base64",
              success: (data) => {
                const base64 = "data:image/png;base64," + data.data;
                imgList.value[index] = base64;
                imgList.value.push(common_addImg.imgAdd);
              }
            });
          }
        });
      }
    };
    let imgList = common_vendor.ref([common_addImg.imgAdd]);
    const deleteImg = (item) => {
      imgList.value = imgList.value.filter((elem) => elem !== item);
    };
    const publish = () => {
      imgList.value.pop();
      form.value.imgId = randomId.value;
      form.value.imgs = imgList.value;
      form.value.userAccount = formModel.value.account;
      common_request.request.post("/equiptment/save", form.value).then(
        (res) => {
          if (res.data.code === 1) {
            common_vendor.index.showToast({
              title: "发布成功"
            });
            randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
            imgList.value = [];
            imgList.value.push(common_addImg.imgAdd);
            form.value = {};
            form.value.userAccount = formModel.value.account;
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
        a: common_vendor.unref(form).title,
        b: common_vendor.o(($event) => common_vendor.unref(form).title = $event.detail.value),
        c: common_vendor.unref(form).price,
        d: common_vendor.o(($event) => common_vendor.unref(form).price = $event.detail.value),
        e: common_vendor.unref(form).descContent,
        f: common_vendor.o(($event) => common_vendor.unref(form).descContent = $event.detail.value),
        g: common_vendor.f(common_vendor.unref(imgList), (item, index, i0) => {
          return common_vendor.e({
            a: item,
            b: index !== common_vendor.unref(imgList).length - 1
          }, index !== common_vendor.unref(imgList).length - 1 ? {
            c: common_vendor.o(($event) => deleteImg(item), index)
          } : {}, {
            d: common_vendor.o(($event) => openFileSelector(index), index),
            e: index
          });
        }),
        h: common_vendor.o(publish)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/community/equiptmentRelease.vue"]]);
wx.createPage(MiniProgramPage);
