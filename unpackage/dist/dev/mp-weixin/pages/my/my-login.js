"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
const common_defalutAvatar = require("../../common/defalutAvatar.js");
require("../../common/config.js");
const _sfc_main = {
  __name: "my-login",
  setup(__props) {
    let isRegister = common_vendor.ref(false);
    let formModel = common_vendor.ref({
      account: "",
      password: "",
      repassword: ""
    });
    const userSotre = store_user.useUserStore();
    let codeImgae = common_vendor.ref("");
    const register = () => {
      isRegister.value = true;
      formModel.value = {};
      getCode();
    };
    const getCode = () => {
      common_request.request.get("/user/captcha").then((result) => {
        formModel.value.key = result.data.data[0];
        codeImgae.value = result.data.data[1];
      });
    };
    const submitRegest = () => {
      common_request.request.post("/user/register", formModel.value).then(
        (result) => {
          console.log(result);
          if (result.data.code === 1) {
            formModel.value.avatar = common_defalutAvatar.defalutAvatar;
            userSotre.setUser(formModel.value);
            userSotre.setToken(result.data.data);
            common_vendor.index.switchTab({
              url: "/pages/home/home"
            });
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
          }
        }
      );
    };
    common_vendor.ref(true);
    const onSubmit = (e) => {
      e.preventDefault();
      if (checkForm()) {
        common_request.request.post("/user/login", formModel.value).then(
          (result) => {
            if (result.data.code === 1) {
              if (result.data.data.avatar === "" || result.data.data.avatar === void 0) {
                result.data.data.avatar = common_defalutAvatar.defalutAvatar;
              }
              userSotre.setToken(result.data.data.token);
              userSotre.setUser(result.data.data);
              common_vendor.index.switchTab({
                url: "/pages/home/home"
              });
              common_vendor.index.showToast({
                title: "登录成功",
                icon: "success"
              });
            } else {
              common_vendor.index.showToast({
                title: "账号或密码有误",
                icon: "error"
              });
            }
          }
        );
      }
    };
    const checkForm = () => {
      if (isRegister.value === false) {
        if (formModel.value.account.trim().length === 0) {
          common_vendor.index.showToast({
            title: "账号不能为空",
            icon: "error"
          });
          return false;
        } else if (formModel.value.password.trim().length === 0) {
          common_vendor.index.showToast({
            title: "密码不能为空",
            icon: "error"
          });
          return false;
        } else {
          return true;
        }
      } else {
        if (formModel.value.account.trim().length === 0) {
          common_vendor.index.showToast({
            title: "账号不能为空",
            icon: "error"
          });
          return false;
        } else if (formModel.value.password.trim().length === 0) {
          common_vendor.index.showToast({
            title: "密码不能为空",
            icon: "error"
          });
          return false;
        } else if (formModel.value.repassword.trim().length === 0) {
          common_vendor.index.showToast({
            title: "确认密码不能为空",
            icon: "error"
          });
          return false;
        } else if (formModel.value.repassword.trim() !== formModel.value.password.trim()) {
          common_vendor.index.showToast({
            title: "两次密码不一致",
            icon: "error"
          });
          return false;
        } else {
          return true;
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: common_vendor.unref(isRegister)
      }, common_vendor.unref(isRegister) ? {
        c: common_vendor.unref(formModel).name,
        d: common_vendor.o(($event) => common_vendor.unref(formModel).name = $event.detail.value)
      } : {}, {
        e: common_vendor.unref(formModel).account,
        f: common_vendor.o(($event) => common_vendor.unref(formModel).account = $event.detail.value),
        g: common_vendor.unref(formModel).password,
        h: common_vendor.o(($event) => common_vendor.unref(formModel).password = $event.detail.value),
        i: common_vendor.unref(isRegister)
      }, common_vendor.unref(isRegister) ? {
        j: common_vendor.unref(formModel).repassword,
        k: common_vendor.o(($event) => common_vendor.unref(formModel).repassword = $event.detail.value)
      } : {}, {
        l: common_vendor.unref(isRegister)
      }, common_vendor.unref(isRegister) ? common_vendor.e({
        m: common_vendor.unref(isRegister)
      }, common_vendor.unref(isRegister) ? {
        n: common_vendor.unref(formModel).code,
        o: common_vendor.o(($event) => common_vendor.unref(formModel).code = $event.detail.value)
      } : {}, {
        p: common_vendor.o(getCode),
        q: common_vendor.unref(codeImgae)
      }) : {}, {
        r: !common_vendor.unref(isRegister)
      }, !common_vendor.unref(isRegister) ? {
        s: common_vendor.o(onSubmit)
      } : {}, {
        t: common_vendor.unref(isRegister)
      }, common_vendor.unref(isRegister) ? {
        v: common_vendor.o(submitRegest)
      } : {}, {
        w: !common_vendor.unref(isRegister)
      }, !common_vendor.unref(isRegister) ? {
        x: common_vendor.o(register)
      } : {}, {
        y: common_vendor.unref(isRegister)
      }, common_vendor.unref(isRegister) ? {
        z: common_vendor.o(register)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/my/my-login.vue"]]);
wx.createPage(MiniProgramPage);
