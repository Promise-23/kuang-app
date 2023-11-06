"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  Login();
}
const Login = () => "../components/login-view.js";
const _sfc_main = {
  __name: "my-page",
  setup(__props) {
    const list_data = common_vendor.reactive({
      whole: [
        {
          index: 0,
          name: "查看全部订单",
          icon: "/static/detail/xiangyou-jiantou.svg",
          query: {}
        }
      ],
      list: [
        {
          index: 1,
          name: "待付款",
          icon: "/static/detail/daifukuan.svg",
          query: { pay_success: "not_pay" }
        },
        {
          index: 2,
          name: "待发货",
          icon: "/static/detail/daifahuo.svg",
          query: { pay_success: "success", deliver: "stay" }
        },
        {
          index: 3,
          name: "待收货",
          icon: "/static/detail/daishouhuo.svg",
          query: { pay_success: "success", deliver: "already" }
        },
        {
          index: 4,
          name: "待评价",
          icon: "/static/detail/daipingjia.svg",
          query: { pay_success: "success", deliver: "rece_goods", evaluate: false }
        }
      ]
    });
    common_vendor.onShow(() => {
      staTus();
    });
    const user = common_vendor.reactive({ user_infor: {}, exist: false });
    const { user_infor, exist } = common_vendor.toRefs(user);
    const mockPhone = common_vendor.computed(() => {
      var _a;
      const tel = ((_a = user_infor.value) == null ? void 0 : _a.phone) ?? "";
      return tel.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    });
    function staTus() {
      const user_data = common_vendor.wx$1.getStorageSync("user_infor");
      if (user_data) {
        user.exist = true;
        queryUserInfo();
      } else {
        user.exist = false;
      }
    }
    function goLogin() {
      console.log("gologin");
      AccConfig_answer.login_user.show = true;
    }
    function goLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认退出登录吗？",
        success: function(res) {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("user_infor");
            common_vendor.index.switchTab({
              //跳转到主页
              url: "/pages/index/index",
              success: () => {
                common_vendor.wx$1.showToast({
                  title: "退出成功"
                });
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    common_vendor.watch(() => AccConfig_answer.login_user.response, (newVal, oldVal) => {
      staTus();
    });
    function viewOrder(index, query) {
      if (user.exist) {
        let obj = JSON.stringify({ index, query });
        common_vendor.wx$1.navigateTo({
          url: `/pages/All-orders/order?obj=${obj}`
        });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    }
    function getInfo() {
      if (user.exist) {
        common_vendor.wx$1.navigateTo({
          url: "/pages/Re-address/address"
        });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    }
    function myCollect() {
      if (user.exist) {
        common_vendor.wx$1.navigateTo({
          url: "/pages/My-collection/collection"
        });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    }
    const db = common_vendor.wx$1.cloud.database();
    async function queryUserInfo() {
      const query_openid = await db.collection("user_infor").get();
      console.log("queryUserInfo", query_openid);
      if (query_openid.data.length > 0) {
        const info = query_openid.data[0];
        user.user_infor = info;
        common_vendor.wx$1.setStorageSync("user_infor", info);
      }
    }
    function goDetail(type) {
      const url = `/pages/property/${type}`;
      console.log("goDetail", url);
      common_vendor.wx$1.navigateTo({
        url
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(exist)
      }, common_vendor.unref(exist) ? {
        b: common_vendor.unref(user_infor).avatarUrl,
        c: common_vendor.t(common_vendor.unref(user_infor).nickName),
        d: common_vendor.t(common_vendor.unref(mockPhone)),
        e: common_vendor.o(goLogout)
      } : {
        g: common_vendor.o(goLogin)
      }, {
        f: !common_vendor.unref(exist),
        h: common_vendor.unref(exist)
      }, common_vendor.unref(exist) ? {
        i: common_vendor.t(common_vendor.unref(user_infor).integral || 0),
        j: common_vendor.o(($event) => goDetail("integral")),
        k: common_vendor.t(common_vendor.unref(user_infor).coupon || 0),
        l: common_vendor.o(($event) => goDetail("coupon")),
        m: common_vendor.t(common_vendor.unref(user_infor).kcoin || 0),
        n: common_vendor.o(($event) => goDetail("kcoin"))
      } : {}, {
        o: common_vendor.f(list_data.whole, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.icon,
            c: index,
            d: common_vendor.o(($event) => viewOrder(item.index, item.query), index)
          };
        }),
        p: common_vendor.f(list_data.list, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: index,
            d: common_vendor.o(($event) => viewOrder(item.index, item.query), index)
          };
        }),
        q: common_vendor.o(myCollect),
        r: common_vendor.o(getInfo)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d9593e3f"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/my-page/my-page.vue"]]);
wx.createPage(MiniProgramPage);
