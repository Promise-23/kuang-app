"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "privacy-view",
  setup(__props) {
    const showPrivacy = common_vendor.ref(true);
    const resolvePrivacyAuthorization = common_vendor.ref();
    common_vendor.index.hideTabBar();
    console.log("wx.onNeedPrivacyAuthorization", common_vendor.wx$1.onNeedPrivacyAuthorization);
    if (common_vendor.wx$1.onNeedPrivacyAuthorization) {
      common_vendor.wx$1.onNeedPrivacyAuthorization((resolve) => {
        console.log("resolve", resolve);
      });
    }
    common_vendor.onLoad((event) => {
      common_vendor.wx$1.onNeedPrivacyAuthorization((resolve, eventInfo) => {
        console.log("触发本次事件的接口是：" + eventInfo.referrer);
        showPrivacy.value = true;
        resolvePrivacyAuthorization.value = resolve;
      });
      common_vendor.wx$1.getUserProfile({
        success: console.log,
        fail: console.error
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showPrivacy.value
      }, showPrivacy.value ? {} : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2eab5286"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/components/privacy-view.vue"]]);
wx.createComponent(Component);
