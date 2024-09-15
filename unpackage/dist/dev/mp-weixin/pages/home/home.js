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
  __name: "home",
  setup(__props, { expose }) {
    common_vendor.ref([
      "jhk-1698925751762.jpg"
    ]);
    let list = common_vendor.ref([]);
    let randomId = common_vendor.ref("");
    const formModel = common_vendor.ref({
      account: "",
      password: "",
      repassword: "",
      name: "",
      avatar: ""
    });
    common_vendor.onPullDownRefresh(() => {
      list = common_vendor.ref([]);
      getDynamicsPage();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onShow(
      () => {
        const userStore = store_user.useUserStore();
        const { token } = userStore;
        if (token === "") {
          console.log("未登录");
          common_vendor.index.navigateTo({
            url: "/pages/my/my-login"
          });
        } else {
          const { user } = userStore;
          formModel.value = user;
          console.log(formModel.value, "form");
          getDynamicsPage();
          getNotcies();
        }
      }
    );
    common_vendor.ref([1, 2, 3, 4, 5]);
    const previewImage = (item) => {
      common_vendor.index.previewImage({
        urls: [item],
        current: item
      });
    };
    let isAdd = common_vendor.ref(true);
    let limit = 5;
    let currentLimit = 0;
    let data = {
      currentLimit,
      limit
    };
    const getDynamicsPage = () => {
      if (!isAdd.value) {
        return;
      }
      isLoading.value = true;
      common_request.request.get("/dynamics/getDynamicsPage", data).then((res) => {
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
          getMyFollow();
        } else {
          isAdd.value = false;
          isLoading.value = false;
        }
      });
    };
    let isLoading = common_vendor.ref(false);
    common_vendor.onReachBottom(() => {
      getDynamicsPage();
      common_vendor.index.stopPullDownRefresh();
    });
    let notices = common_vendor.ref([]);
    const getNotcies = () => {
      common_request.request.get("/notice/getNoticeLimit").then(
        (res) => {
          notices.value = res.data.data;
          console.log(res, "res");
        }
      );
    };
    common_vendor.ref({
      descContent: "",
      userAccount: formModel.value.account,
      id: randomId.value
    });
    expose({
      getDynamicsPage
    });
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
    const saveFollow = (befollowUserAccount, index) => {
      followForm.value.befollowUserAccount = befollowUserAccount;
      followForm.value.followUserAccount = formModel.value.account;
      common_request.request.post("/follow/saveFollow", followForm.value).then((res) => {
        console.log(res, "fxxollow");
        list.value.forEach((item) => {
          if (item.userAccount === list.value[index].userAccount) {
            item.isFollow = true;
          }
        });
      });
    };
    let followList = common_vendor.ref([]);
    const getMyFollow = () => {
      common_request.request.get("/follow/getMyFollow?userAccount=" + formModel.value.account).then((res) => {
        console.log(res, "userfollow");
        if (res.data.data !== null && res.data.data !== void 0 && res.data.data.length > 0) {
          followList.value = res.data.data;
          checkFollow();
        }
      });
    };
    const checkFollow = () => {
      list.value.forEach((item) => {
        followList.value.forEach((follow) => {
          if (item.userAccount === follow.account) {
            item.isFollow = true;
          }
        });
      });
    };
    const cancelFollow = async (item) => {
      common_vendor.index.showModal({
        title: "是否取消关注？",
        success: (res) => {
          if (res.confirm) {
            followForm.value.befollowUserAccount = item.userAccount;
            followForm.value.followUserAccount = formModel.value.account;
            common_request.request.delete("/follow/deleteFollow", followForm.value).then((res2) => {
              if (res2.data.code === 1) {
                list.value.forEach((item2, index) => {
                  if (item2.userAccount === list.value[index].userAccount) {
                    item2.isFollow = false;
                  }
                });
              }
            });
          } else if (res.cancel)
            ;
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(notices), (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => previewImage(item.data), item.id),
            b: item.data,
            c: item.id
          };
        }),
        b: common_vendor.f(common_vendor.unref(list), (item, index, i0) => {
          return common_vendor.e({
            a: item.user.avatar,
            b: common_vendor.t(item.user.name),
            c: item.user.account !== formModel.value.account && !item.isFollow
          }, item.user.account !== formModel.value.account && !item.isFollow ? {
            d: common_vendor.o(($event) => saveFollow(item.user.account, index), item.id)
          } : {}, {
            e: item.user.account !== formModel.value.account && item.isFollow
          }, item.user.account !== formModel.value.account && item.isFollow ? {
            f: common_vendor.o(($event) => cancelFollow(item), item.id)
          } : {}, {
            g: common_vendor.t(item.createTime),
            h: common_vendor.t(item.descContent),
            i: common_vendor.f(item.imgs, (item2, index2, i1) => {
              return {
                a: item2,
                b: common_vendor.o(($event) => previewImage(item2), index2),
                c: index2
              };
            }),
            j: !item.isLike
          }, !item.isLike ? {
            k: "be7a965e-0-" + i0,
            l: common_vendor.p({
              type: "hand-up",
              size: "20"
            })
          } : {}, {
            m: item.isLike
          }, item.isLike ? {
            n: "be7a965e-1-" + i0,
            o: common_vendor.p({
              type: "hand-up-filled",
              size: "20"
            })
          } : {}, {
            p: common_vendor.t(item.likeCount),
            q: common_vendor.o(($event) => dyLike(index, item.id), item.id),
            r: "be7a965e-2-" + i0,
            s: common_vendor.o(($event) => setCurrentComment(index), item.id),
            t: common_vendor.f(item.comments, (commont, k1, i1) => {
              return {
                a: common_vendor.t(commont.commentUserName),
                b: common_vendor.t(commont.commentContent),
                c: commont.commentUserAccount
              };
            }),
            v: item.isComment
          }, item.isComment ? {
            w: common_vendor.unref(commentForm).commentContent,
            x: common_vendor.o(($event) => common_vendor.unref(commentForm).commentContent = $event.detail.value, item.id),
            y: common_vendor.o(($event) => publishComment(index, item.id), item.id)
          } : {}, {
            z: item.id
          });
        }),
        c: common_vendor.p({
          type: "chat",
          size: "20"
        }),
        d: common_vendor.unref(isAdd) && common_vendor.unref(isLoading)
      }, common_vendor.unref(isAdd) && common_vendor.unref(isLoading) ? {} : {}, {
        e: !common_vendor.unref(isAdd) && !common_vendor.unref(isLoading)
      }, !common_vendor.unref(isAdd) && !common_vendor.unref(isLoading) ? {} : {}, {
        f: common_vendor.o((...args) => _ctx.handleRefresh && _ctx.handleRefresh(...args)),
        g: common_vendor.o((...args) => _ctx.handleLoadMore && _ctx.handleLoadMore(...args))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/home/home.vue"]]);
wx.createPage(MiniProgramPage);
