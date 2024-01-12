"use strict";
const common_vendor = require("../../../common/vendor.js");
const AccConfig_placeOrder = require("../../../Acc-config/place-order.js");
const AccConfig_answer = require("../../../Acc-config/answer.js");
const AccConfig_public = require("../../../Acc-config/public.js");
const _sfc_main = {
  __name: "purchase",
  props: { goods_id: String, collection: Number, sku_data: Array, goods: Object },
  setup(__props) {
    const props = __props;
    const result = common_vendor.reactive({ goods_id: "", whether: true, tips: "", goods: {} });
    common_vendor.toRefs(result);
    common_vendor.watch(props, (newVal, oldVal) => {
      let { goods_id, goods } = JSON.parse(JSON.stringify(newVal));
      result.goods_id = goods_id;
      result.goods = goods;
      if (goods.shelves == false) {
        if (goods.stock <= 0) {
          result.whether = false;
          result.tips = "该商品已下架";
        } else {
          result.whether = false;
          result.tips = "该商品已下架";
        }
      } else if (goods.stock <= 0) {
        console.log("进来");
        if (!goods.shelves) {
          result.whether = false;
          result.tips = "该商品已下架";
        } else {
          result.whether = false;
          result.tips = "该商品已售完";
        }
      }
    });
    let COLL = common_vendor.ref(0);
    common_vendor.watch(() => props.collection, (newVal, oldVal) => {
      COLL.value = newVal;
    });
    common_vendor.wx$1.cloud.database();
    async function purChase(judge, sku) {
      const user = common_vendor.wx$1.getStorageSync("user_infor");
      if (!user) {
        AccConfig_answer.login_user.show = true;
        return false;
      }
      if (sku.length > 0) {
        AccConfig_answer.sku_popup.show = true;
        AccConfig_answer.sku_popup.judge = judge;
      } else {
        AccConfig_placeOrder.ORDER.order.buy_amount = 1;
        if (judge == "j_sho") {
          try {
            let res = await AccConfig_placeOrder.SHCART();
            new AccConfig_public.Plublic().toast(res);
          } catch (err) {
            new AccConfig_public.Plublic().toast(err);
          }
        } else {
          AccConfig_placeOrder.ORDER.order.subtotal = parseFloat((AccConfig_placeOrder.ORDER.order.goods_price * AccConfig_placeOrder.ORDER.order.buy_amount).toFixed(10));
          AccConfig_answer.sku_popup.show = false;
          const STR = JSON.stringify([AccConfig_placeOrder.ORDER.order]);
          common_vendor.wx$1.navigateTo({
            //direct单个商品下单
            url: `/pages/Pay-view/pay?order=${STR}&type=direct`
          });
        }
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.s("height:" + _ctx.S_top + "px;"),
        b: common_vendor.o((...args) => _ctx.goTo && _ctx.goTo(...args)),
        c: common_vendor.f(_ctx.tab_name, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index == _ctx.trigger ? 1 : "",
            c: index,
            d: common_vendor.o(($event) => _ctx.swItch(index), index)
          };
        }),
        d: common_vendor.s("height:" + _ctx.S_height + "px;"),
        e: common_vendor.s("height:" + _ctx.S_height + "px;"),
        f: common_vendor.s("padding-right:" + _ctx.S_width + "px;"),
        g: _ctx.styleOpacity,
        h: _ctx.being,
        i: common_vendor.o(($event) => purChase("j_pur", __props.sku_data))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9e61e9a3"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Gift-details/component/purchase.vue"]]);
wx.createComponent(Component);
