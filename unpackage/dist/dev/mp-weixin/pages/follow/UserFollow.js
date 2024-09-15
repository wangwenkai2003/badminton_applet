"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/user.js");
const common_request = require("../../common/request.js");
require("../../common/config.js");
const _sfc_main = {
  __name: "UserFollow",
  setup(__props) {
    let followData = common_vendor.ref({});
    common_vendor.onLoad((options) => {
      followData.value = JSON.parse(options.data);
      if (followData.value.type === "follow") {
        getMyFollow(followData.value.account);
      }
      if (followData.value.type === "beFollow") {
        common_vendor.index.setNavigationBarTitle({
          title: "粉丝"
        });
        getMyBeFollow(followData.value.account);
      }
    });
    let followList = common_vendor.ref([]);
    const getMyFollow = (account) => {
      common_request.request.get("/follow/getMyFollow?userAccount=" + account).then((res) => {
        if (res.data.data !== null && res.data.data !== void 0 && res.data.data.length > 0) {
          followList.value = res.data.data;
        } else {
          followList.value = [];
        }
      });
    };
    const getMyBeFollow = (account) => {
      common_request.request.get("/follow/getMyBeFollow?userAccount=" + account).then((res) => {
        if (res.data.data !== null && res.data.data !== void 0 && res.data.data.length > 0) {
          followList.value = res.data.data;
          console.log(followList.value);
        } else {
          followList.value = [];
        }
      });
    };
    const followForm = common_vendor.ref({
      befollowUserAccount: "",
      followUserAccount: ""
    });
    const cancelFollow = async (item) => {
      common_vendor.index.showModal({
        title: "是否取消关注？",
        success: (res) => {
          if (res.confirm) {
            followForm.value.befollowUserAccount = item.account;
            followForm.value.followUserAccount = followData.value.account;
            common_request.request.delete("/follow/deleteFollow", followForm.value).then((res2) => {
              if (res2.data.code === 1) {
                getMyFollow(followData.value.account);
              }
            });
          } else if (res.cancel)
            ;
        }
      });
    };
    const saveFollow = (item) => {
      console.log(item.account);
      followForm.value.befollowUserAccount = item.account;
      followForm.value.followUserAccount = followData.value.account;
      common_request.request.post("/follow/saveFollow", followForm.value).then((res) => {
        if (res.data.code === 1) {
          getMyBeFollow(followData.value.account);
        }
      });
    };
    const gotoUserDetail = (item) => {
      common_vendor.index.navigateTo({
        url: "/subpkg/userDeatil/userDeatil?userAccount=" + item.account,
        success: (res) => {
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(followList), (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.o(($event) => gotoUserDetail(item), item.account),
            b: item.avatar,
            c: common_vendor.t(item.name),
            d: common_vendor.o(($event) => gotoUserDetail(item), item.account),
            e: common_vendor.unref(followData).type === "follow" || item.follow
          }, common_vendor.unref(followData).type === "follow" || item.follow ? {
            f: common_vendor.o(($event) => cancelFollow(item), item.account)
          } : {}, {
            g: common_vendor.unref(followData).type === "beFollow" && !item.follow
          }, common_vendor.unref(followData).type === "beFollow" && !item.follow ? {
            h: common_vendor.o(($event) => saveFollow(item), item.account)
          } : {}, {
            i: item.account
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/follow/UserFollow.vue"]]);
wx.createPage(MiniProgramPage);
