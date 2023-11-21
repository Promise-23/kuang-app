"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_public = require("../../Acc-config/public.js");
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
        getCoupons();
        getIntegral();
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
    function goWelfare() {
      if (user.exist) {
        common_vendor.wx$1.navigateTo({
          url: "/pages/welfare/center"
        });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    }
    async function getCoupons(coupon) {
      var _a;
      const res = await db.collection("coupon_detail").where({ used: false }).get();
      console.log("getCoupons", res == null ? void 0 : res.data);
      const rightTimeList = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.filter((item) => AccConfig_public.transferTime(item.time[0]) <= AccConfig_public.currentTime() && AccConfig_public.transferTime(item.time[1]) >= AccConfig_public.currentTime());
      console.log("rightTimeList", rightTimeList);
      AccConfig_answer.myCoupons.data = rightTimeList;
    }
    async function getIntegral() {
      const res = await db.collection("integral_detail").get();
      console.log("integralDetail", res.data);
      AccConfig_answer.myIntegral.data = res.data;
      AccConfig_answer.myIntegral.count = res.data.reduce(function(prev, cur) {
        console.log("reduce", prev, cur);
        return prev + (cur.type == "add" ? cur.num : -1 * cur.num);
      }, 0);
    }
    function copyCode() {
      var _a;
      if (user.exist) {
        common_vendor.index.setClipboardData({
          data: (_a = user == null ? void 0 : user.user_infor) == null ? void 0 : _a._id,
          //要被复制的内容
          success: () => {
            common_vendor.index.showToast({
              //提示
              title: "复制成功"
            });
          },
          fail() {
            common_vendor.index.showToast({
              //提示
              title: "复制失败"
            });
          }
        });
      } else {
        AccConfig_answer.login_user.show = true;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(exist)
      }, common_vendor.unref(exist) ? {
        b: common_vendor.unref(user_infor).avatarUrl,
        c: common_vendor.t(common_vendor.unref(user_infor).nickName),
        d: common_vendor.t(common_vendor.unref(mockPhone)),
        e: common_vendor.o(copyCode),
        f: common_vendor.o(goLogout)
      } : {
        h: common_vendor.o(goLogin)
      }, {
        g: !common_vendor.unref(exist),
        i: common_vendor.unref(exist)
      }, common_vendor.unref(exist) ? {
        j: common_vendor.t(common_vendor.unref(AccConfig_answer.myIntegral).count || 0),
        k: common_vendor.o(($event) => goDetail("integral")),
        l: common_vendor.t(common_vendor.unref(AccConfig_answer.myCoupons).data.length),
        m: common_vendor.o(($event) => goDetail("coupon"))
      } : {}, {
        n: common_vendor.f(list_data.whole, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.icon,
            c: index,
            d: common_vendor.o(($event) => viewOrder(item.index, item.query), index)
          };
        }),
        o: common_vendor.f(list_data.list, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: index,
            d: common_vendor.o(($event) => viewOrder(item.index, item.query), index)
          };
        }),
        p: common_vendor.o(myCollect),
        q: common_vendor.o(getInfo),
        r: common_vendor.o(goWelfare)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d9593e3f"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/my-page/my-page.vue"]]);
wx.createPage(MiniProgramPage);
