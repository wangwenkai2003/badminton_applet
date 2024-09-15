"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_request = require("../../common/request.js");
const store_user = require("../../store/user.js");
const common_config = require("../../common/config.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    let currentTop = common_vendor.ref("0");
    const onScrollTop = () => {
    };
    const onScroll = (e) => {
      if (e.detail.scrollTop < 50) {
        getMessagePages();
        common_vendor.index.pageScrollTo({
          scrollTop: 400,
          // 设置一个足够大的值，使页面滚动到底部
          duration: 0,
          success: () => {
            currentTop.value = e.detail.scrollHeight;
            console.log("滚动成功");
          }
        });
      }
    };
    let randomId = common_vendor.ref("");
    randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const formModel = common_vendor.ref({
      account: "",
      password: "",
      repassword: "",
      name: "",
      avatar: ""
    });
    const toFormModel = common_vendor.ref({
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
    let toAccout = common_vendor.ref("");
    const previewImage = (item) => {
      common_vendor.index.previewImage({
        urls: [item],
        current: item
      });
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
              info.value.img = "";
              info.value.ifImg = 1;
              let sendInfo = Rinfo;
              sendInfo.value = {};
              sendInfo.value.from = info.value.from;
              sendInfo.value.content = info.value.content;
              sendInfo.value.img = base64;
              sendInfo.value.ifImg = 1;
              infoList.value.push(sendInfo.value);
              console.log(infoList.value, "iv");
              chatImg.value.data = base64;
              chatImg.value.chatId = info.value.id;
              info.value.ifImg = 1;
              common_request.request.post("/chat/saveImg", chatImg.value);
              common_vendor.index.sendSocketMessage({
                data: JSON.stringify(info.value)
              });
            }
          });
        }
      });
    };
    let chatImg = common_vendor.ref({
      chatId: randomId.value,
      from: "",
      to: "",
      data: ""
    });
    var socket = null;
    let info = common_vendor.ref({
      id: randomId.value,
      from: "",
      to: "",
      content: "",
      ifReceive: "",
      ifImg: 0
    });
    let Rinfo = common_vendor.ref({
      from: "",
      content: "",
      ifImg: 0
    });
    let infoList = common_vendor.ref([]);
    common_vendor.onReady(
      () => {
        common_vendor.index.pageScrollTo({
          scrollTop: 9999,
          duration: 0,
          success: () => {
            common_vendor.index.pageScrollTo(
              {
                scrollTop: -20,
                duration: 0
              }
            );
          }
        });
      }
    );
    let page = common_vendor.ref({
      fromAccount: "",
      toAccount: "",
      currentLimit: 0,
      limit: 10
    });
    common_vendor.onLoad((options) => {
      infoList.value = [];
      info.value.from = formModel.value.account;
      info.value.to = options.userAccount;
      toAccout.value = options.userAccount;
      common_request.request.get("/user/getUserByAccount?account=" + options.userAccount).then(
        (res) => {
          toFormModel.value = res.data.data;
          common_vendor.index.setNavigationBarTitle({
            title: toFormModel.value.name
          });
        }
      );
      common_vendor.ref({
        fromAccount: account.value,
        toAccount: options.userAccount
      });
      page.value.fromAccount = account.value;
      page.value.toAccount = options.userAccount;
      getMessagePages();
      socket = common_vendor.index.connectSocket({
        url: common_config.config.WS_SERVER_URL + "/imserver/" + account.value,
        // url:'ws://192.168.0.103:2003/imserver/202104279',
        success: (res) => {
          console.log(res, "res");
          console.info("创建连接成功");
        }
      });
      socket.onOpen(function() {
        console.info("连接打开成功");
      });
      socket.onMessage(function(e) {
        console.log(e.data, "ed");
        if (e.data === "对方不在线") {
          info.value.ifReceive = 0;
          common_request.request.post("/chat/send", info.value);
          info.value.content = "";
          randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
          info.value.id = randomId.value;
        } else if (e.data === "对方不在线且发的图片") {
          info.value.ifImg = 1;
          info.value.ifReceive = 0;
          common_request.request.post("/chat/send", info.value);
          info.value.content = "";
          info.value.ifImg = 0;
          randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
          info.value.id = randomId.value;
        } else {
          if (e.data === "对方在线") {
            info.value.ifReceive = 1;
            common_request.request.post("/chat/send", info.value);
            info.value.content = "";
            randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
            info.value.id = randomId.value;
            return;
          }
          if (e.data === "对方在线且发的图片") {
            info.value.ifReceive = 1;
            info.value.ifImg = 1;
            common_request.request.post("/chat/send", info.value);
            info.value.content = "";
            info.value.ifImg = 0;
            randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
            info.value.id = randomId.value;
            return;
          }
          if (e.data !== "") {
            let temp = info.value.from;
            info.value.from = info.value.to;
            info.value.to = temp;
            info.value.content = e.data;
            info.value.ifReceive = 1;
            common_request.request.post("/chat/send", info.value);
            info.value.content = "";
            randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36);
            info.value.id = randomId.value;
            let newRinfo = Rinfo;
            newRinfo.value = [];
            newRinfo.value.from = toAccout.value;
            newRinfo.value.content = e.data;
            newRinfo.value.ifImg = 0;
            infoList.value.push(newRinfo.value);
          } else {
            let messageForm = common_vendor.ref({
              fromUser: toFormModel.value.account,
              toUser: formModel.value.account
            });
            common_request.request.get("/chat/getImg", messageForm.value).then(
              (res) => {
                let newRinfo = Rinfo;
                newRinfo.value = [];
                newRinfo.value.from = toAccout.value;
                newRinfo.value.img = res.data.data;
                newRinfo.value.ifImg = 1;
                infoList.value.push(newRinfo.value);
                console.log(res, "rr");
              }
            );
          }
        }
      });
    });
    let isAdd = common_vendor.ref(true);
    let limit = 10;
    const getMessagePages = () => {
      if (!isAdd.value) {
        return;
      }
      common_request.request.get("/chat/getMessagePage", page.value).then((res) => {
        if (res.data.code === 1) {
          if (res.data.data.length < limit) {
            isAdd.value = false;
          } else {
            page.value.currentLimit = page.value.currentLimit + 10;
          }
          infoList.value = [...res.data.data, ...infoList.value];
          console.log(infoList.value, "ive");
        } else {
          isAdd.value = false;
        }
      });
    };
    common_vendor.onUnload(() => {
      console.log("页面被卸载");
      common_vendor.index.closeSocket();
      console.log("连接关闭");
    });
    const sendMsg = () => {
      if (info.value.content !== "" || info.value.img !== "") {
        let sendInfo = Rinfo;
        sendInfo.value = [];
        sendInfo.value.from = info.value.from;
        sendInfo.value.content = info.value.content;
        sendInfo.value.img = info.value.img;
        sendInfo.value.ifImg = 0;
        console.log(sendInfo.value, "sss");
        infoList.value.push(sendInfo.value);
        common_vendor.index.sendSocketMessage({
          data: JSON.stringify(info.value)
        });
        common_vendor.index.pageScrollTo({
          selector: ".bottom",
          duration: 300,
          success: () => {
            console.log("success");
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(infoList), (item, index, i0) => {
          return common_vendor.e({
            a: item.from === common_vendor.unref(toAccout)
          }, item.from === common_vendor.unref(toAccout) ? common_vendor.e({
            b: toFormModel.value.avatar,
            c: item.ifImg === 0
          }, item.ifImg === 0 ? {
            d: common_vendor.t(item.content)
          } : {}, {
            e: item.ifImg === 1
          }, item.ifImg === 1 ? {
            f: common_vendor.o(($event) => previewImage(item.img), index),
            g: item.img
          } : {}) : {}, {
            h: item.from === common_vendor.unref(account)
          }, item.from === common_vendor.unref(account) ? common_vendor.e({
            i: item.ifImg === 0
          }, item.ifImg === 0 ? {
            j: common_vendor.t(item.content)
          } : {}, {
            k: item.ifImg === 1
          }, item.ifImg === 1 ? {
            l: common_vendor.o(($event) => previewImage(item.img), index),
            m: item.img
          } : {}, {
            n: formModel.value.avatar
          }) : {}, {
            o: index
          });
        }),
        b: common_vendor.o(onScrollTop),
        c: common_vendor.o(onScroll),
        d: common_vendor.o(openFileSelector),
        e: common_assets._imports_0$2,
        f: common_vendor.unref(info).content,
        g: common_vendor.o(($event) => common_vendor.unref(info).content = $event.detail.value),
        h: common_vendor.o(sendMsg)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/front_end/uni-project/badminton/subpkg/chat/chat.vue"]]);
wx.createPage(MiniProgramPage);
