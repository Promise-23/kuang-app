"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const AccConfig_public = require("../../Acc-config/public.js");
const _sfc_main = {
  __name: "login-view",
  setup(__props) {
    async function login() {
      try {
        await new AccConfig_public.Plublic().login();
        AccConfig_answer.login_user.show = false;
        AccConfig_answer.login_user.response = "success";
      } catch (e) {
        new AccConfig_public.Plublic().toast("登录失败,重试");
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(AccConfig_answer.login_user).show
      }, common_vendor.unref(AccConfig_answer.login_user).show ? {
        b: common_vendor.o(login),
        c: common_vendor.o(($event) => common_vendor.unref(AccConfig_answer.login_user).show = false)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1dd05679"], ["__file", "D:/hujie/Applet/kuangApplet/kuang-user/pages/components/login-view.vue"]]);
wx.createComponent(Component);
