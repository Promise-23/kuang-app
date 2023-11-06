"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const AccConfig_orde_number = require("../../Acc-config/orde_number.js");
const AccConfig_wxPay = require("../../Acc-config/wx-pay.js");
const AccConfig_public = require("../../Acc-config/public.js");
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
      let sum = 0;
      or_data.order.forEach((item) => sum += item.subtotal);
      or_data.total_price = parseFloat(sum.toFixed(10));
    });
    function reDuce() {
      or_data.order[0].buy_amount--;
      or_data.order[0].subtotal = parseFloat((or_data.order[0].buy_amount * or_data.order[0].goods_price).toFixed(10));
      or_data.total_price = or_data.order[0].subtotal;
    }
    function plUs() {
      or_data.order[0].buy_amount++;
      or_data.order[0].subtotal = parseFloat((or_data.order[0].buy_amount * or_data.order[0].goods_price).toFixed(10));
      or_data.total_price = or_data.order[0].subtotal;
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
          common_vendor.wx$1.hideLoading();
          common_vendor.wx$1.redirectTo({ url: "/pages/All-orders/order" });
        }
      },
      onError: (err) => {
      }
    });
    return (_ctx, _cache) => {
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
        f: common_vendor.t(common_vendor.unref(total_price)),
        g: common_vendor.o(subMit)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Pay-view/pay.vue"]]);
wx.createPage(MiniProgramPage);
