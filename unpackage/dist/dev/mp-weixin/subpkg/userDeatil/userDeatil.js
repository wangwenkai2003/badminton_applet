"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
  __name: "userDeatil",
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
    const followAccount = user.account;
    formModel.value = user;
    let list = common_vendor.ref([]);
    const toFormModel = common_vendor.ref({
      account: "",
      password: "",
      repassword: "",
      name: "",
      avatar: ""
    });
    common_vendor.onLoad((option) => {
      common_request.request.get("/user/getUserByAccount?account=" + option.userAccount).then(
        (res) => {
          checkFollow(followAccount, option.userAccount);
          toFormModel.value = res.data.data;
          data.userAccount = toFormModel.value.account;
          getDynamicsPage();
        }
      );
    });
    const gotoChat = () => {
      common_vendor.index.navigateTo({
        url: "/subpkg/chat/chat?userAccount=" + toFormModel.value.account
      });
    };
    let isAdd = common_vendor.ref(true);
    let limit = 5;
    let currentLimit = 0;
    let data = {
      userAccount: "",
      currentLimit,
      limit
    };
    let isLoading = common_vendor.ref(false);
    const getDynamicsPage = () => {
      if (!isAdd.value) {
        return;
      }
      isLoading.value = true;
      common_request.request.get("/dynamics/getDynamicsByUserAccount", data).then((res) => {
        if (res.data.code === 1) {
          if (res.data.data.length < limit) {
            isAdd.value = false;
          } else {
            data.currentLimit = data.currentLimit + 5;
          }
          list.value = [...list.value, ...res.data.data];
          isLoading.value = false;
          console.log(isAdd.value);
          checkLike();
          setComment();
        } else {
          isAdd.value = false;
          isLoading.value = false;
        }
      });
    };
    const likeForm = common_vendor.ref({
      dynamicsId: "",
      userAccount: ""
    });
    const dyLike = (index, id) => {
      let isLike = list.value[index].isLike;
      if (!isLike) {
        likeForm.value.dynamicsId = id;
        likeForm.value.userAccount = formModel.value.account;
        list.value[index].likeCount = list.value[index].likeCount + 1;
        list.value[index].isLike = true;
        common_request.request.post("/dyLike/save", likeForm.value).then((res) => {
          console.log(res);
        });
      }
    };
    const checkLike = () => {
      list.value.forEach((item, index) => {
        item.dyLikes.forEach((item2) => {
          if (item2.userAccount === formModel.value.account) {
            list.value[index].isLike = true;
          }
        });
      });
    };
    const setComment = () => {
      list.value.forEach((item) => {
        item.isComment = false;
      });
    };
    const setCurrentComment = (index) => {
      setComment();
      list.value[index].isComment = true;
    };
    let commentForm = common_vendor.ref({
      dynamicsId: "",
      commentUserAccount: formModel.value.account,
      commentContent: "",
      commentUserName: ""
    });
    const publishComment = (index, id) => {
      commentForm.value.commentUserName = formModel.value.name;
      commentForm.value.commentUserAccount = formModel.value.account;
      commentForm.value.dynamicsId = id;
      common_request.request.post("/comment/publish", commentForm.value).then((res) => {
        if (res.data.code === 1) {
          list.value[index].comments.push(commentForm.value);
          commentForm.value = {};
          console.log(list.value);
        }
      });
    };
    const followForm = common_vendor.ref({
      befollowUserAccount: "",
      followUserAccount: ""
    });
    const saveFollow = (befollowUserAccount) => {
      followForm.value.befollowUserAccount = befollowUserAccount;
      followForm.value.followUserAccount = user.account;
      common_request.request.post("/follow/saveFollow", followForm.value).then((res) => {
        if (res.data.code == 1) {
          isFollow.value = true;
        }
      });
    };
    let isFollow = common_vendor.ref(true);
    const checkFollow = (followAccount2, beFollowAccount) => {
      console.log(followAccount2, "ff");
      console.log(beFollowAccount, "ff");
      common_request.request.get(`/follow/checkFollow?followAccount=${followAccount2}&beFollowAccount=${beFollowAccount}`).then((res) => {
        if (res.data.code === 0) {
          isFollow.value = false;
        }
      });
    };
    const cancelFollow = async (beFollowAccount) => {
      common_vendor.index.showModal({
        title: "是否取消关注？",
        success: (res) => {
          if (res.confirm) {
            followForm.value.befollowUserAccount = beFollowAccount;
            followForm.value.followUserAccount = formModel.value.account;
            common_request.request.delete("/follow/deleteFollow", followForm.value).then((res2) => {
              if (res2.data.code === 1) {
                isFollow.value = false;
              }
            });
          } else if (res.cancel)
            ;
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o((...args) => _ctx.previewImage && _ctx.previewImage(...args)),
        b: toFormModel.value.avatar,
        c: common_vendor.t(toFormModel.value.name),
        d: toFormModel.value.sex === "0"
      }, toFormModel.value.sex === "0" ? {
        e: common_assets._imports_0
      } : {}, {
        f: toFormModel.value.sex === "1"
      }, toFormModel.value.sex === "1" ? {
        g: common_assets._imports_1
      } : {}, {
        h: !common_vendor.unref(isFollow)
      }, !common_vendor.unref(isFollow) ? {
        i: common_vendor.o(($event) => saveFollow(toFormModel.value.account))
      } : {}, {
        j: common_vendor.unref(isFollow)
      }, common_vendor.unref(isFollow) ? {
        k: common_vendor.o(($event) => cancelFollow(toFormModel.value.account))
      } : {}, {
        l: common_vendor.o(gotoChat),
        m: common_vendor.f(common_vendor.unref(list), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.createTime),
            b: common_vendor.t(item.descContent),
            c: common_vendor.f(item.imgs, (item2, index2, i1) => {
              return {
                a: item2,
                b: common_vendor.o(($event) => _ctx.previewImage(item2), index2),
                c: index2
              };
            }),
            d: !item.isLike
          }, !item.isLike ? {
            e: "c3602822-0-" + i0,
            f: common_vendor.p({
              type: "hand-up",
              size: "20"
            })
          } : {}, {
            g: item.isLike
          }, item.isLike ? {
            h: "c3602822-1-" + i0,
            i: common_vendor.p({
              type: "hand-up-filled",
              size: "20"
            })
          } : {}, {
            j: common_vendor.t(item.likeCount),
            k: common_vendor.o(($event) => dyLike(index, item.id), item.id),
            l: "c3602822-2-" + i0,
            m: common_vendor.o(($event) => setCurrentComment(index), item.id),
            n: common_vendor.f(item.comments, (commont, k1, i1) => {
              return {
                a: common_vendor.t(commont.commentUserName),
                b: common_vendor.t(commont.commentContent),
                c: commont.commentUserAccount
              };
            }),
            o: item.isComment
          }, item.isComment ? {
            p: common_vendor.unref(commentForm).commentContent,
            q: common_vendor.o(($event) => common_vendor.unref(commentForm).commentContent = $event.detail.value, item.id),
            r: common_vendor.o(($event) => publishComment(index, item.id), item.id)
          } : {}, {
            s: item.id
          });
        }),
        n: toFormModel.value.avatar,
        o: common_vendor.t(toFormModel.value.name),
        p: common_vendor.p({
          type: "chat",
          size: "20"
        }),
        q: common_vendor.unref(isAdd) && common_vendor.unref(isLoading)
      }, common_vendor.unref(isAdd) && common_vendor.unref(isLoading) ? {} : {}, {
        r: !common_vendor.unref(isAdd) && !common_vendor.unref(isLoading)
      }, !common_vendor.unref(isAdd) && !common_vendor.unref(isLoading) ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/subpkg/userDeatil/userDeatil.vue"]]);
wx.createPage(MiniProgramPage);
