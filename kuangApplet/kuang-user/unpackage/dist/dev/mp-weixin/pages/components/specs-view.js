"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const AccConfig_placeOrder = require("../../Acc-config/place-order.js");
const AccConfig_public = require("../../Acc-config/public.js");
const _sfc_main = {
  __name: "specs-view",
  props: { sku_data: Array, goods: Object },
  setup(__props) {
    const props = __props;
    const customStyle = common_vendor.ref("border-radius: 10px 10px 0 0");
    const skudata = common_vendor.reactive({
      goods: {},
      new_sku: [],
      all_sku: [],
      sku_length: 0,
      sku_sort: {}
    });
    const { goods, new_sku } = common_vendor.toRefs(skudata);
    common_vendor.watch(props, (newVal_a, oldVal) => {
      const newVal = JSON.parse(JSON.stringify(newVal_a));
      skudata.goods = newVal.goods;
      if (newVal.sku_data.length === 0)
        return false;
      const sku_data = newVal.sku_data[0];
      skudata.all_sku = sku_data.sku;
      skudata.sku_length = sku_data.sku[0].att_data.length;
      sku_data.sku[0].att_data.forEach((item, index) => {
        skudata.sku_sort = { ...skudata.sku_sort, ...{ [item.att_name]: index } };
      });
      const sku_name = sku_data.sku[0].att_data.map((item) => item.att_name);
      let new_sku2 = [];
      let att_length = sku_data.sku[0].att_data.length;
      for (let i = 0; i < sku_name.length; i++) {
        let res = sku_data.sku.map((item) => {
          if (att_length == 1) {
            return { att_val: item.att_data[i].att_val, stock: item.stock };
          } else {
            return { att_val: item.att_data[i].att_val, act: false };
          }
        });
        let obj = {};
        let removal = res.reduce((prev, item) => {
          if (!obj[item.att_val]) {
            prev.push(item);
            obj[item.att_val] = true;
          }
          return prev;
        }, []);
        new_sku2.push({ att_name: sku_name[i], sku: removal });
      }
      skudata.new_sku = new_sku2;
    });
    const selectdata = common_vendor.reactive({ select: [], seleIndex: [] });
    const { select, seleIndex } = common_vendor.toRefs(selectdata);
    function choIce(att_val, att_name, index, index_one) {
      let IN = selectdata.select.findIndex((item) => item.att_name == att_name);
      if (IN > -1) {
        let MB = selectdata.select.findIndex((item) => item.att_val == att_val);
        if (MB > -1) {
          selectdata.select.splice(IN, 1);
          selectdata.seleIndex[index] = -1;
        } else {
          selectdata.select[IN] = { att_name, att_val };
          selectdata.seleIndex[index] = index_one;
        }
      } else {
        selectdata.select.push({ att_name, att_val });
        selectdata.seleIndex[index] = index_one;
      }
      if (selectdata.select.length == skudata.sku_length) {
        selectdata.select.sort((p1, p2) => {
          return skudata.sku_sort[p1.att_name] - skudata.sku_sort[p2.att_name];
        });
        let query_sku = skudata.all_sku.filter((item) => {
          return JSON.stringify(item.att_data) == JSON.stringify(selectdata.select);
        });
        skudata.goods.goods_cover = query_sku[0].image;
        skudata.goods.goods_price = query_sku[0].price;
        skudata.goods.stock = query_sku[0].stock;
      }
      if (skudata.new_sku.length == 1)
        return false;
      let raw = common_vendor.toRaw(skudata);
      raw.all_sku.forEach((item) => item["custom"] = "");
      selectdata.select.forEach((item_k, index_k) => {
        raw.all_sku.forEach((item, index2) => {
          if (item.stock === 0) {
            item.att_data.forEach((item_i, index_i) => {
              if (item_i.att_name == item_k.att_name && item_i.att_val == item_k.att_val) {
                raw.all_sku[index2].custom += item_i.att_val;
              }
            });
          }
        });
      });
      let STR = "";
      selectdata.select.forEach((item) => STR += item.att_val);
      if (STR == "") {
        var new_res = [];
      } else {
        var new_res = raw.all_sku.filter((item) => item.custom == STR);
      }
      if (new_res.length > 0) {
        for (let i = 0; i < new_res.length; i++) {
          for (let m = 0; m < new_res[i].att_data.length; m++) {
            for (let I = 0; I < skudata.new_sku.length; I++) {
              for (let k = 0; k < skudata.new_sku[I].sku.length; k++) {
                selectdata.select.forEach(async (item_se) => {
                  if (item_se.att_name != skudata.new_sku[I].att_name && new_res[i].att_data[m].att_val == skudata.new_sku[I].sku[k].att_val) {
                    await common_vendor.nextTick$1();
                    skudata.new_sku[I].sku[k].act = true;
                    selectdata.seleIndex[I] = -1;
                    let DE = selectdata.select.findIndex((item) => item.att_val == skudata.new_sku[I].sku[k].att_val);
                    if (DE > -1) {
                      selectdata.select.splice(DE, 1);
                    }
                  }
                });
              }
            }
          }
        }
      } else {
        skudata.new_sku.forEach(async (item, index2) => {
          await common_vendor.nextTick$1();
          item.sku.forEach((item_act, index_act) => {
            if (item_act.act) {
              skudata.new_sku[index2].sku[index_act].act = false;
            }
          });
        });
      }
    }
    const goods_amount = common_vendor.ref(1);
    function reDuce() {
      goods_amount.value--;
    }
    function plUs() {
      goods_amount.value++;
    }
    async function subMit(judge) {
      if (selectdata.select.length != skudata.new_sku.length) {
        new AccConfig_public.Plublic().toast("请选择商品规格");
      } else {
        AccConfig_placeOrder.ORDER.order.buy_amount = goods_amount.value;
        AccConfig_placeOrder.ORDER.order.specs = selectdata.select;
        AccConfig_placeOrder.ORDER.order.goods_image = skudata.goods.goods_cover;
        AccConfig_placeOrder.ORDER.order.goods_price = AccConfig_placeOrder.ORDER.exist ? AccConfig_placeOrder.ORDER.order.goods_price : skudata.goods.goods_price;
        if (judge == "j_sho") {
          console.log("加入购物车");
          try {
            let res = await AccConfig_placeOrder.SHCART();
            new AccConfig_public.Plublic().toast(res);
            AccConfig_answer.sku_popup.show = false;
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
    function clickoverlay() {
      AccConfig_answer.sku_popup.show = false;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(goods).goods_cover,
        b: common_vendor.t(common_vendor.unref(goods).goods_price),
        c: common_vendor.unref(AccConfig_placeOrder.ORDER).exist
      }, common_vendor.unref(AccConfig_placeOrder.ORDER).exist ? {
        d: common_vendor.t(common_vendor.unref(AccConfig_placeOrder.ORDER).order.goods_price)
      } : {}, {
        e: common_vendor.t(common_vendor.unref(goods).stock),
        f: common_vendor.t(common_vendor.unref(select).length > 0 ? "已选择" : "请选择"),
        g: common_vendor.unref(select).length == 0
      }, common_vendor.unref(select).length == 0 ? {
        h: common_vendor.f(common_vendor.unref(new_sku), (item, index, i0) => {
          return {
            a: common_vendor.t(item.att_name),
            b: index
          };
        })
      } : {
        i: common_vendor.f(common_vendor.unref(select), (item, index, i0) => {
          return {
            a: common_vendor.t(item.att_val),
            b: index
          };
        })
      }, {
        j: common_vendor.o(($event) => common_vendor.unref(AccConfig_answer.sku_popup).show = false),
        k: common_vendor.unref(new_sku).length == 1
      }, common_vendor.unref(new_sku).length == 1 ? {
        l: common_vendor.f(common_vendor.unref(new_sku), (item, index, i0) => {
          return {
            a: common_vendor.t(item.att_name),
            b: common_vendor.f(item.sku, (item_one, index_one, i1) => {
              return {
                a: common_vendor.t(item_one.att_val),
                b: index_one,
                c: common_vendor.n(item_one.stock == 0 ? "prevent_style" : ""),
                d: common_vendor.n(common_vendor.unref(seleIndex)[index] == index_one ? "new_style" : ""),
                e: common_vendor.o(($event) => choIce(item_one.att_val, item.att_name, index, index_one), index_one)
              };
            }),
            c: index
          };
        })
      } : {
        m: common_vendor.f(common_vendor.unref(new_sku), (item, index, i0) => {
          return {
            a: common_vendor.t(item.att_name),
            b: common_vendor.f(item.sku, (item_one, index_one, i1) => {
              return {
                a: common_vendor.t(item_one.att_val),
                b: index_one,
                c: common_vendor.n(item_one.act ? "prevent_style" : ""),
                d: common_vendor.n(common_vendor.unref(seleIndex)[index] == index_one ? "new_style" : ""),
                e: common_vendor.o(($event) => choIce(item_one.att_val, item.att_name, index, index_one), index_one)
              };
            }),
            c: index
          };
        })
      }, {
        n: common_vendor.o(reDuce),
        o: common_vendor.n(goods_amount.value == 1 ? "prevent_style" : ""),
        p: common_vendor.t(goods_amount.value),
        q: common_vendor.o(plUs),
        r: common_vendor.t(common_vendor.unref(AccConfig_answer.sku_popup).judge == "j_sho" ? "加入购物车" : "立即购买"),
        s: common_vendor.o(($event) => subMit(common_vendor.unref(AccConfig_answer.sku_popup).judge)),
        t: customStyle.value,
        v: common_vendor.unref(AccConfig_answer.sku_popup).show,
        w: common_vendor.o(clickoverlay)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9366c3b2"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/components/specs-view.vue"]]);
wx.createComponent(Component);
