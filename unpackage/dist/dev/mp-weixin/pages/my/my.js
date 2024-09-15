"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
require("../../common/config.js");
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const formModel = common_vendor.ref({
      account: "",
      password: "",
      repassword: "",
      name: "",
      avatar: ""
    });
    let account = common_vendor.ref("");
    const userStore = store_user.useUserStore();
    const { user } = userStore;
    formModel.value = user;
    account.value = formModel.value.account;
    common_vendor.onShow(() => {
      getFollowAndFans(account.value);
      getDynamicsCount(account.value);
    });
    common_vendor.ref([]);
    let followCount = common_vendor.ref(0);
    let beFollowCount = common_vendor.ref(0);
    const getFollowAndFans = (account2) => {
      console.log(formModel.value, "fv");
      common_request.request.get("/follow/getFollowAndFans?userAccount=" + account2).then(
        (result) => {
          if (result.data.code === 1) {
            followCount.value = result.data.data[0];
            beFollowCount.value = result.data.data[1];
          }
        }
      );
    };
    let dynamicsCount = common_vendor.ref(0);
    const getDynamicsCount = (account2) => {
      common_request.request.get("/dynamics/getDynamicsCount?userAccount=" + account2.value).then(
        (result) => {
          if (result.data.code === 1) {
            dynamicsCount.value = result.data.data;
          }
        }
      );
    };
    let followData = common_vendor.ref({
      account: account.value,
      type: ""
    });
    const toFollow = () => {
      followData.value.type = "follow";
      common_vendor.index.navigateTo({
        url: "/pages/follow/UserFollow?data=" + JSON.stringify(followData.value)
      });
    };
    const toBeFollow = () => {
      followData.value.type = "beFollow";
      common_vendor.index.navigateTo({
        url: "/pages/follow/UserFollow?data=" + JSON.stringify(followData.value)
      });
    };
    const updateUser = () => {
      common_vendor.index.navigateTo({
        url: "/pages/my/update-user"
      });
    };
    const exit = () => {
      common_vendor.index.showModal({
        title: "是否要退出登录O.o？",
        success: (res) => {
          if (res.confirm) {
            userStore.removeToken();
            userStore.setUser({});
            common_vendor.index.navigateTo({
              url: "/pages/my/my-login"
            });
          } else if (res.cancel)
            ;
        }
      });
    };
    const previewImage = () => {
      common_vendor.index.previewImage({
        urls: [formModel.value.avatar],
        current: formModel.value.avatar
      });
    };
    const collect = () => {
      common_vendor.index.navigateTo({
        url: "/subpkg/collect/collect"
      });
    };
    const toReserve = () => {
      common_vendor.index.navigateTo({
        url: "/subpkg/myclloect/myclloect"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(previewImage),
        b: formModel.value.avatar,
        c: common_vendor.t(formModel.value.name),
        d: formModel.value.sex === "0"
      }, formModel.value.sex === "0" ? {
        e: common_assets._imports_0
      } : {}, {
        f: formModel.value.sex === "1"
      }, formModel.value.sex === "1" ? {
        g: common_assets._imports_1
      } : {}, {
        h: common_vendor.t(common_vendor.unref(followCount)),
        i: common_vendor.o(toFollow),
        j: common_vendor.t(common_vendor.unref(beFollowCount)),
        k: common_vendor.o(toBeFollow),
        l: common_vendor.t(common_vendor.unref(dynamicsCount)),
        m: common_assets._imports_2,
        n: common_vendor.o(updateUser),
        o: common_assets._imports_3,
        p: common_vendor.o(collect),
        q: common_assets._imports_4,
        r: common_vendor.o(toReserve),
        s: common_assets._imports_5,
        t: common_vendor.o(exit)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2f1ef635"], ["__file", "F:/front_end/uni-project/badminton/pages/my/my.vue"]]);
wx.createPage(MiniProgramPage);
