"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const common_request = require("../../common/request.js");
require("../../common/config.js");
const _sfc_main = {
  __name: "message",
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
    let messageList = common_vendor.ref([]);
    common_vendor.onShow(() => {
      messageList.value = [];
      common_request.request.get("/chat/getChats?formUser=" + user.account).then(
        (res) => {
          for (var key in res.data.data) {
            let messageValue = res.data.data[key];
            messageValue.filter((item) => item.ifReceive === 0);
            let lastMessage = messageValue[messageValue.length - 1];
            console.log(lastMessage);
            const newKey = key.split("-");
            let filterKey = newKey.filter((item) => item !== user.account);
            common_request.request.get("/user/getUserByAccount?account=" + filterKey).then(
              (res2) => {
                var mergedObject = { ...lastMessage, ...res2.data.data };
                messageList.value.push(mergedObject);
              }
            );
          }
          console.log(messageList.value, "mlt");
        }
      );
    });
    const gotoChat = (account) => {
      common_vendor.index.navigateTo({
        url: "/subpkg/chat/chat?userAccount=" + account
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(messageList), (item, k0, i0) => {
          return common_vendor.e({
            a: item.avatar,
            b: common_vendor.t(item.name),
            c: item.ifImg === 0
          }, item.ifImg === 0 ? {
            d: common_vendor.t(item.content)
          } : {}, {
            e: item.ifImg === 1
          }, item.ifImg === 1 ? {} : {}, {
            f: common_vendor.o(($event) => gotoChat(item.account))
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/pages/message/message.vue"]]);
wx.createPage(MiniProgramPage);
