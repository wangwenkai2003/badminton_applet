"use strict";
const common_vendor = require("./common/vendor.js");
const common_request = require("./common/request.js");
const store_user = require("./store/user.js");
const common_addImg = require("./common/addImg.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "./uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "myDynamicsCard",
  setup(__props, { expose }) {
    let list = common_vendor.ref([]);
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
    common_vendor.onPullDownRefresh(() => {
      list = common_vendor.ref([]);
      getDynamicsPage();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onShow(
      () => {
        const userStore2 = store_user.useUserStore();
        const { token } = userStore2;
        if (token === "") {
          common_vendor.index.navigateTo({
            url: "/pages/my/my-login"
          });
        } else {
          const { user: user2 } = userStore2;
          formModel.value = user2;
          data.userAccount = formModel.value.account;
          getDynamicsPage();
        }
      }
    );
    let imgList = common_vendor.ref([common_addImg.imgAdd]);
    const openFileSelector = (index) => {
      if (index === imgList.value.length - 1) {
        common_vendor.index.chooseImage({
          success: (res) => {
            const tempFilePaths = res.tempFilePaths;
            const fs = common_vendor.index.getFileSystemManager();
            fs.readFile({
              filePath: tempFilePaths[0],
              encoding: "base64",
              success: (data2) => {
                const base64 = "data:image/png;base64," + data2.data;
                imgList.value[index] = base64;
                imgList.value.push(common_addImg.imgAdd);
              }
            });
          }
        });
      }
    };
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
      userAccount: "",
      currentLimit,
      limit
    };
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
    let randomId = common_vendor.ref("");
    randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const deleteImg = (item) => {
      imgList.value = imgList.value.filter((elem) => elem !== item);
    };
    let form = common_vendor.ref({
      descContent: "",
      userAccount: formModel.value.account,
      id: randomId.value
    });
    const publish = () => {
      imgList.value.pop();
      form.value.images = imgList.value;
      common_request.request.post("/dynamics/appPublish", form.value).then(
        (res) => {
          randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
          if (res.data.code === 1) {
            form.value.descContent = "";
            form.value.id = randomId.value;
            imgList.value = [];
            imgList.value.push(common_addImg.imgAdd);
            getDynamicsPage();
            common_vendor.index.showToast({
              title: "发布成功"
            });
          }
        }
      );
    };
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
        }
      });
    };
    common_vendor.ref({
      befollowUserAccount: "",
      followUserAccount: ""
    });
    let followList = common_vendor.ref([]);
    const getMyFollow = () => {
      common_request.request.get("/follow/getMyFollow?userAccount=" + formModel.value.account).then((res) => {
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(form).descContent,
        b: common_vendor.o(($event) => common_vendor.unref(form).descContent = $event.detail.value),
        c: common_vendor.f(common_vendor.unref(imgList), (item, index, i0) => {
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
        d: common_vendor.o(publish),
        e: common_vendor.f(common_vendor.unref(list), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.createTime),
            b: common_vendor.t(item.descContent),
            c: common_vendor.f(item.imgs, (item2, index2, i1) => {
              return {
                a: item2,
                b: common_vendor.o(($event) => previewImage(item2), index2),
                c: index2
              };
            }),
            d: !item.isLike
          }, !item.isLike ? {
            e: "bd098354-0-" + i0,
            f: common_vendor.p({
              type: "hand-up",
              size: "20"
            })
          } : {}, {
            g: item.isLike
          }, item.isLike ? {
            h: "bd098354-1-" + i0,
            i: common_vendor.p({
              type: "hand-up-filled",
              size: "20"
            })
          } : {}, {
            j: common_vendor.t(item.likeCount),
            k: common_vendor.o(($event) => dyLike(index, item.id), item.id),
            l: "bd098354-2-" + i0,
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
        f: formModel.value.avatar,
        g: common_vendor.t(formModel.value.name),
        h: common_vendor.p({
          type: "chat",
          size: "20"
        }),
        i: common_vendor.unref(isAdd) && common_vendor.unref(isLoading)
      }, common_vendor.unref(isAdd) && common_vendor.unref(isLoading) ? {} : {}, {
        j: !common_vendor.unref(isAdd) && !common_vendor.unref(isLoading)
      }, !common_vendor.unref(isAdd) && !common_vendor.unref(isLoading) ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/commpoents/myDynamicsCard/myDynamicsCard.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
