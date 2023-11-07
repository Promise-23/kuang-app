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
    const { whether, tips } = common_vendor.toRefs(result);
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
    const db = common_vendor.wx$1.cloud.database();
    async function toCollect(n) {
      const user = common_vendor.wx$1.getStorageSync("user_infor");
      if (!user) {
        AccConfig_answer.login_user.show = true;
        return false;
      }
      if (n === 0) {
        try {
          await db.collection("collect_goods").add({ data: { goods_id: result.goods_id } });
          COLL.value++;
        } catch (e) {
          new AccConfig_public.Plublic().toast("收藏失败");
        }
      } else {
        try {
          await db.collection("collect_goods").where({ goods_id: result.goods_id }).remove();
          COLL.value = 0;
        } catch (e) {
          new AccConfig_public.Plublic().toast("取消收藏失败");
        }
      }
    }
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
    function goCart() {
      common_vendor.wx$1.switchTab({
        url: "/pages/shopping-cart/shopping-cart"
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(AccConfig_placeOrder.ORDER).nu_sh_cart > 0
      }, common_vendor.unref(AccConfig_placeOrder.ORDER).nu_sh_cart > 0 ? {
        b: common_vendor.t(common_vendor.unref(AccConfig_placeOrder.ORDER).nu_sh_cart)
      } : {}, {
        c: common_vendor.o(goCart),
        d: common_vendor.unref(COLL) <= 0
      }, common_vendor.unref(COLL) <= 0 ? {} : {}, {
        e: common_vendor.t(common_vendor.unref(COLL) > 0 ? "已收藏" : "收藏"),
        f: common_vendor.o(($event) => toCollect(common_vendor.unref(COLL))),
        g: common_vendor.unref(whether)
      }, common_vendor.unref(whether) ? {
        h: common_vendor.o(($event) => purChase("j_sho", __props.sku_data))
      } : {}, {
        i: common_vendor.unref(whether)
      }, common_vendor.unref(whether) ? {
        j: common_vendor.o(($event) => purChase("j_pur", __props.sku_data))
      } : {
        k: common_vendor.t(common_vendor.unref(tips))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-571f8077"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Product-details/component/purchase.vue"]]);
wx.createComponent(Component);
