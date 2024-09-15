"use strict";
const common_vendor = require("../../common/vendor.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
require("../../common/config.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "equiptmentDetail",
  setup(__props) {
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
    let isFollow = common_vendor.ref(-1);
    let equiptment = common_vendor.ref({});
    common_vendor.onLoad((option) => {
      const item = JSON.parse(decodeURIComponent(option.equiptment));
      equiptment.value = item;
      getMyFollow();
      checkCollect();
    });
    const followForm = common_vendor.ref({
      befollowUserAccount: "",
      followUserAccount: ""
    });
    const saveFollow = () => {
      followForm.value.befollowUserAccount = equiptment.value.account;
      followForm.value.followUserAccount = formModel.value.account;
      common_request.request.post("/follow/saveFollow", followForm.value).then((res) => {
        isFollow.value = 1;
      });
    };
    let followList = common_vendor.ref([]);
    const getMyFollow = () => {
      if (equiptment.value.user.account === formModel.value.account) {
        isFollow.value = 0;
        return;
      }
      common_request.request.get("/follow/getMyFollow?userAccount=" + formModel.value.account).then((res) => {
        console.log(res, "userfollow");
        if (res.data.data !== null && res.data.data !== void 0 && res.data.data.length > 0) {
          followList.value = res.data.data;
          followList.value.forEach((follow) => {
            if (equiptment.value.user.account === follow.account) {
              isFollow.value = 1;
            }
          });
        }
      });
    };
    const cancelFollow = async () => {
      common_vendor.index.showModal({
        title: "是否取消关注？",
        success: (res) => {
          if (res.confirm) {
            followForm.value.befollowUserAccount = equiptment.value.user.account;
            followForm.value.followUserAccount = formModel.value.account;
            common_request.request.delete("/follow/deleteFollow", followForm.value).then((res2) => {
              if (res2.data.code === 1) {
                isFollow.value = -1;
              }
            });
          } else if (res.cancel)
            ;
        }
      });
    };
    const gotoChat = () => {
      common_vendor.index.navigateTo({
        url: "/subpkg/chat/chat?userAccount=" + equiptment.value.user.account
      });
    };
    let collectForm = common_vendor.ref({
      userAccount: "",
      equiptmentId: ""
    });
    const toCollect = () => {
      collectForm.value.userAccount = formModel.value.account;
      collectForm.value.equiptmentId = equiptment.value.id;
      common_request.request.post("/collect/save", collectForm.value).then(
        (res) => {
          if (res.data.code === 1) {
            isCollect.value = true;
          }
        }
      );
    };
    let isCollect = common_vendor.ref(false);
    const checkCollect = () => {
      common_request.request.get("/collect/getByAccount?userAccount=" + formModel.value.account).then(
        (res) => {
          res.data.data.forEach((item) => {
            if (item.equiptmentId === equiptment.value.id) {
              isCollect.value = true;
            }
          });
        }
      );
    };
    let cancleCollct = () => {
      collectForm.value.userAccount = formModel.value.account;
      collectForm.value.equiptmentId = equiptment.value.id;
      common_request.request.post("/collect/delete", collectForm.value).then(
        (res) => {
          if (res.data.code === 1) {
            isCollect.value = false;
          }
        }
      );
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(equiptment).user.avatar,
        b: common_vendor.t(common_vendor.unref(equiptment).user.name),
        c: common_vendor.unref(isFollow) === -1
      }, common_vendor.unref(isFollow) === -1 ? {
        d: common_vendor.o(($event) => saveFollow())
      } : {}, {
        e: common_vendor.unref(isFollow) === 1
      }, common_vendor.unref(isFollow) === 1 ? {
        f: common_vendor.o(($event) => cancelFollow())
      } : {}, {
        g: common_vendor.t(common_vendor.unref(equiptment).price),
        h: common_vendor.t(common_vendor.unref(equiptment).descContent),
        i: common_vendor.f(common_vendor.unref(equiptment).imgs, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        j: !common_vendor.unref(isCollect)
      }, !common_vendor.unref(isCollect) ? {
        k: common_vendor.p({
          type: "star",
          size: "30"
        }),
        l: common_vendor.o(toCollect)
      } : {}, {
        m: common_vendor.unref(isCollect)
      }, common_vendor.unref(isCollect) ? {
        n: common_vendor.p({
          type: "star-filled",
          size: "30"
        }),
        o: common_vendor.o((...args) => common_vendor.unref(cancleCollct) && common_vendor.unref(cancleCollct)(...args))
      } : {}, {
        p: common_vendor.p({
          type: "chatbubble",
          size: "30"
        }),
        q: common_vendor.o(gotoChat)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2bbb8847"], ["__file", "F:/front_end/uni-project/badminton/pages/community/equiptmentDetail.vue"]]);
wx.createPage(MiniProgramPage);
