"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const AccConfig_orde_number = require("../../Acc-config/orde_number.js");
const AccConfig_wxPay = require("../../Acc-config/wx-pay.js");
const AccConfig_public = require("../../Acc-config/public.js");
if (!Math) {
  couponView();
}
const couponView = () => "../components/coupon-view.js";
const _sfc_main = {
  __name: "pay",
  setup(__props) {
    common_vendor.hooks.locale("zh-cn");
    const db = common_vendor.wx$1.cloud.database();
    const re_data = common_vendor.reactive({ address: [] });
    const { address } = common_vendor.toRefs(re_data);
    common_vendor.onMounted(async () => {
      const res = await db.collection("re_address").where({ tacitly: true }).get();
      re_data.address = res.data;
      getCoupons();
    });
    function choIce() {
      common_vendor.wx$1.navigateTo({
        url: "/pages/Re-address/address"
      });
    }
    common_vendor.watch(AccConfig_answer.new_address, (newVal, oldVal) => {
      re_data.address = [newVal.data];
    });
    const or_data = common_vendor.reactive({ order: [], type: "", total_price: 0 });
    const { order, type, total_price } = common_vendor.toRefs(or_data);
    common_vendor.onLoad((event) => {
      const data = JSON.parse(event.order);
      or_data.order = data;
      or_data.type = event.type;
      calcPrice();
    });
    function calcPrice() {
      let sum = 0;
      or_data.order.forEach((item) => sum += item.subtotal);
      or_data.total_price = parseFloat(sum.toFixed(10));
    }
    function reDuce() {
      var _a;
      console.log("or_data.order", or_data.order);
      or_data.order[0].buy_amount--;
      or_data.order[0].subtotal = parseFloat((or_data.order[0].buy_amount * or_data.order[0].goods_price).toFixed(10));
      or_data.total_price = or_data.order[0].subtotal;
      if (selectedCoupon.value) {
        const final = or_data.total_price - (((_a = selectedCoupon.value) == null ? void 0 : _a.price) || 0);
        const sum = final > 0 ? final : 0;
        or_data.total_price = parseFloat(sum.toFixed(10));
      }
    }
    function plUs() {
      var _a;
      or_data.order[0].buy_amount++;
      or_data.order[0].subtotal = parseFloat((or_data.order[0].buy_amount * or_data.order[0].goods_price).toFixed(10));
      or_data.total_price = or_data.order[0].subtotal;
      if (selectedCoupon.value) {
        const final = or_data.total_price - (((_a = selectedCoupon.value) == null ? void 0 : _a.price) || 0);
        const sum = final > 0 ? final : 0;
        or_data.total_price = parseFloat(sum.toFixed(10));
      }
    }
    async function subMit() {
      if (re_data.address.length == 0) {
        new AccConfig_public.Plublic().toast("请填写收货地址！");
        return false;
      }
      common_vendor.wx$1.showLoading({ title: "正在下单", mask: true });
      let time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
      let query_time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD");
      or_data.order.forEach((item) => item.order_number = AccConfig_orde_number.coDe());
      let out_trade_no = AccConfig_orde_number.outTradeno();
      try {
        var payment = await new AccConfig_wxPay.Wxpay().pLace(or_data.total_price, out_trade_no);
        const can_res = await new AccConfig_wxPay.Wxpay().suBmit(or_data.order, payment.result, re_data.address, time, query_time, out_trade_no);
        result.out_trade_no = out_trade_no;
        result.or_data = or_data.order;
        console.log("payment.result", payment.result);
        const pay = await new AccConfig_wxPay.Wxpay().payMent(payment.result);
      } catch (err) {
        if (err && err.errMsg == "requestPayment:fail cancel") {
          if (or_data.type == "cart") {
            await new AccConfig_wxPay.Wxpay().deleteCart(or_data.order);
          }
          common_vendor.wx$1.hideLoading();
          common_vendor.wx$1.redirectTo({ url: "/pages/All-orders/order" });
        } else {
          new AccConfig_public.Plublic().toast("支付发生错误");
          await db.collection("order_data").where({ out_trade_no }).remove();
        }
      }
    }
    common_vendor.onBeforeUnmount(() => {
      watcher.close();
    });
    let result = common_vendor.reactive({ out_trade_no: "", or_data: [] });
    const watcher = db.collection("user_infor").watch({
      onChange: async (res) => {
        if (res.docChanges[0].dataType == "update") {
          await new AccConfig_wxPay.Wxpay().staTe("success", result.out_trade_no);
          await new AccConfig_wxPay.Wxpay().resTock(result.or_data);
          if (or_data.type == "cart") {
            await new AccConfig_wxPay.Wxpay().deleteCart(result.or_data);
          }
          handleCouponPayMent();
          handleIntegralAftePay();
          common_vendor.wx$1.hideLoading();
          common_vendor.wx$1.redirectTo({ url: "/pages/All-orders/order" });
        }
      },
      onError: (err) => {
      }
    });
    const showCouponModal = common_vendor.ref(false);
    function showCoupon() {
      showCouponModal.value = true;
    }
    function cancelCoupon() {
      showCouponModal.value = false;
    }
    const couponsInfo = common_vendor.reactive({
      enable: [],
      //可用
      disable: []
      // 不可用原因：1、当前商品不支持 2、满减券，金额不够
    });
    async function getCoupons() {
      var _a;
      const res = await db.collection("coupon_detail").where({ used: false }).get();
      const rightTimeList = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.filter((item) => AccConfig_public.transferTime(item.time[0]) <= AccConfig_public.currentTime() && AccConfig_public.transferTime(item.time[1]) >= AccConfig_public.currentTime());
      console.log("rightTimeList", rightTimeList);
      AccConfig_answer.myCoupons.data = rightTimeList;
      const filterCoupons = filterCoupon(rightTimeList);
      couponsInfo.enable = filterCoupons.enable;
      couponsInfo.disable = filterCoupons.disable;
    }
    const orderTypeList = common_vendor.computed(() => {
      return or_data.order.map((order2) => order2.category);
    });
    function filterCoupon(couponList) {
      const res = { enable: [], disable: [] };
      couponList.forEach((item) => {
        if (item.type == "full" && or_data.total_price < item.full || item.type == "limit" && AccConfig_public.hasSameElement(orderTypeList, item.limit)) {
          res.disable.push(item);
        } else {
          res.enable.push(item);
        }
      });
      return res;
    }
    const selectedCoupon = common_vendor.ref();
    function setSelectedCoupon(coupon) {
      selectedCoupon.value = coupon;
    }
    async function handleCouponPayMent() {
      const id = selectedCoupon.value._id || "";
      await db.collection("coupon_detail").doc(id).update({ data: { used: true } });
    }
    const _ = db.command;
    async function handleIntegralAftePay() {
      const integral = Math.floor(or_data.total_price % 10);
      console.log("handleIntegralAftePay", integral);
      let time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
      await db.collection("integral_detail").add({ data: { type: "add", num: integral, desc: "消费送积分活动！", time } });
      const user_data = common_vendor.wx$1.getStorageSync("user_infor");
      await db.collection("user_infor").doc(user_data == null ? void 0 : user_data._id).update({ data: {
        // 表示指示数据库将字段自增
        integral: _.inc(integral)
      } });
    }
    common_vendor.watch(() => {
      var _a;
      return (_a = selectedCoupon.value) == null ? void 0 : _a.price;
    }, (newVal) => {
      if (newVal > 0) {
        const final = or_data.total_price - newVal;
        const sum = final > 0 ? final : 0;
        or_data.total_price = parseFloat(sum.toFixed(10));
      } else {
        calcPrice();
      }
    });
    common_vendor.watch(() => AccConfig_answer.myCoupons.hasCouponId, () => {
      getCoupons();
    });
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(address), (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.mobile),
            c: common_vendor.t(item.district + item.address),
            d: index,
            e: common_vendor.o(choIce, index)
          };
        }),
        b: common_vendor.unref(address).length == 0
      }, common_vendor.unref(address).length == 0 ? {
        c: common_vendor.o(choIce)
      } : {}, {
        d: common_vendor.f(common_vendor.unref(order), (item, index, i0) => {
          return common_vendor.e({
            a: item.goods_image,
            b: common_vendor.t(item.goods_title),
            c: item.specs.length > 0
          }, item.specs.length > 0 ? {
            d: common_vendor.f(item.specs, (item_a, index_a, i1) => {
              return {
                a: common_vendor.t(item_a.att_val),
                b: index_a
              };
            })
          } : {}, {
            e: common_vendor.t(item.goods_price)
          }, common_vendor.unref(type) != "direct" ? {
            f: common_vendor.t(item.buy_amount)
          } : {
            g: common_vendor.o(reDuce, index),
            h: common_vendor.n(item.buy_amount == 1 ? "prevent_style" : ""),
            i: common_vendor.t(item.buy_amount),
            j: common_vendor.o(plUs, index)
          }, {
            k: index
          });
        }),
        e: common_vendor.unref(type) != "direct",
        f: common_vendor.t(couponsInfo.enable.length),
        g: !selectedCoupon.value && couponsInfo.enable.length > 0,
        h: !selectedCoupon.value && couponsInfo.enable.length == 0,
        i: common_vendor.t(`-￥${((_a = selectedCoupon.value) == null ? void 0 : _a.price) ?? 0}`),
        j: selectedCoupon.value,
        k: common_vendor.o(showCoupon),
        l: common_vendor.t(common_vendor.unref(total_price)),
        m: common_vendor.o(subMit),
        n: common_vendor.o(cancelCoupon),
        o: common_vendor.o(setSelectedCoupon),
        p: common_vendor.p({
          show: showCouponModal.value,
          enableCoupons: couponsInfo.enable,
          disableCoupons: couponsInfo.disable
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b018696c"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Pay-view/pay.vue"]]);
wx.createPage(MiniProgramPage);
