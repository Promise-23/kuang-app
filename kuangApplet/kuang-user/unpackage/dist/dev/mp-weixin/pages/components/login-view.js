"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const AccConfig_public = require("../../Acc-config/public.js");
if (!Math) {
  BrandIcon();
}
const BrandIcon = () => "../Common-component/UI/BrandIcon.js";
const _sfc_main = {
  __name: "login-view",
  setup(__props) {
    async function login() {
      try {
        await new AccConfig_public.Plublic().login(userInfo);
        AccConfig_answer.login_user.show = false;
        AccConfig_answer.login_user.response = "success";
      } catch (e) {
        new AccConfig_public.Plublic().toast("登录失败,重试");
      }
    }
    const userInfo = common_vendor.reactive({ avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0", nickName: "" });
    async function onChooseAvatar(e) {
      console.log("e", e);
      const { avatarUrl } = e.detail;
      console.log("avatarUrl", new AccConfig_public.Plublic().getImageBase64_readFile(avatarUrl));
      userInfo.avatarUrl = await new AccConfig_public.Plublic().getImageBase64_readFile(avatarUrl);
    }
    function getPhoneNumber(e) {
      console.log("phone", e);
    }
    function cancel(e) {
      e.stopPropagation();
      AccConfig_answer.login_user.show = false;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(AccConfig_answer.login_user).show
      }, common_vendor.unref(AccConfig_answer.login_user).show ? {
        b: common_vendor.o(cancel),
        c: userInfo.avatarUrl,
        d: common_vendor.o(onChooseAvatar),
        e: userInfo.nickName,
        f: common_vendor.o(($event) => userInfo.nickName = $event.detail.value),
        g: common_vendor.o(getPhoneNumber),
        h: common_vendor.o(login),
        i: common_vendor.o(($event) => common_vendor.unref(AccConfig_answer.login_user).show = false)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1dd05679"], ["__file", "/Users/hujie/Documents/Kuang+/kuang-app/kuangApplet/kuang-user/pages/components/login-view.vue"]]);
wx.createComponent(Component);
