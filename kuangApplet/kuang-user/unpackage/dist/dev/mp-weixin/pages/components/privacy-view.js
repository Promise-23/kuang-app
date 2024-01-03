"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "privacy-view",
  setup(__props) {
    const showPrivacy = common_vendor.ref(false);
    common_vendor.ref();
    let privacyResolves = /* @__PURE__ */ new Set();
    if (common_vendor.wx$1.onNeedPrivacyAuthorization) {
      common_vendor.wx$1.onNeedPrivacyAuthorization((resolve) => {
        console.log("resolve", resolve);
      });
    }
    common_vendor.onLoad((event) => {
      common_vendor.wx$1.getPrivacySetting({
        success: (res) => {
          console.log(res);
          if (res.needAuthorization) {
            showPrivacy.value = true;
            common_vendor.index.hideTabBar();
          }
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    });
    function handleAgree(e) {
      disPopUp().forEach((resolve) => {
        resolve({
          event: "agree",
          buttonId: "agree-btn"
        });
      });
      privacyResolves.clear();
    }
    function handleDisagree(e) {
      disPopUp();
      privacyResolves.forEach((resolve) => {
        resolve({
          event: "disagree"
        });
      });
      privacyResolves.clear();
      if (window) {
        window.close();
      } else {
        common_vendor.index.navigateBackMiniProgram();
      }
    }
    function disPopUp() {
      showPrivacy.value = false;
      common_vendor.index.showTabBar();
    }
    function openPrivacyContract() {
      common_vendor.wx$1.openPrivacyContract({
        success: (res) => {
          console.log("openPrivacyContract success");
        },
        fail: (res) => {
          console.error("openPrivacyContract fail", res);
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showPrivacy.value
      }, showPrivacy.value ? {
        b: common_vendor.o(openPrivacyContract),
        c: common_vendor.o(handleDisagree),
        d: common_vendor.o(handleAgree)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2eab5286"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/components/privacy-view.vue"]]);
wx.createComponent(Component);
