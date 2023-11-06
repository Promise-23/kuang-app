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
      if (userInfo.avatarUrl == "") {
        new AccConfig_public.Plublic().toast("请选择头像！");
        return false;
      } else if (userInfo.nickName == "") {
        new AccConfig_public.Plublic().toast("请输入昵称！");
        return false;
      } else if (userInfo.phone == "") {
        new AccConfig_public.Plublic().toast("请输入手机号！");
        return false;
      }
      try {
        await new AccConfig_public.Plublic().login(userInfo);
        AccConfig_answer.login_user.show = false;
        AccConfig_answer.login_user.response = "success";
      } catch (e) {
        new AccConfig_public.Plublic().toast("登录失败,重试");
      }
    }
    const userInfo = common_vendor.reactive({ avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0", nickName: "", phone: "" });
    async function onChooseAvatar(e) {
      console.log("e", e);
      const { avatarUrl } = e.detail;
      console.log("avatarUrl", new AccConfig_public.Plublic().getImageBase64_readFile(avatarUrl));
      userInfo.avatarUrl = await new AccConfig_public.Plublic().getImageBase64_readFile(avatarUrl);
    }
    function handleNickName(e) {
      userInfo.nickName = e.detail.value;
    }
    function getPhoneNumber(e) {
      AccConfig_public.getAccessToken().then(({ access_token }) => {
        console.log(e.detail.code, access_token);
        const code = e.detail.code;
        AccConfig_public.getPhoneNumberByToken(code, access_token).then(({ phone_info }) => {
          console.log("getPhoneNumber", phone_info);
          userInfo.phone = phone_info.purePhoneNumber;
        });
      });
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
        e: common_vendor.o(handleNickName),
        f: common_vendor.t(userInfo.phone ? userInfo.phone : "点击获取手机号"),
        g: common_vendor.o(getPhoneNumber),
        h: common_vendor.n(userInfo.phone ? "has-phone" : ""),
        i: common_vendor.o(login),
        j: common_vendor.o(($event) => common_vendor.unref(AccConfig_answer.login_user).show = false)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1dd05679"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/components/login-view.vue"]]);
wx.createComponent(Component);
