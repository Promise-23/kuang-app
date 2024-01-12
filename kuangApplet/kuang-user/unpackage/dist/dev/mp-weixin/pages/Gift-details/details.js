"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_placeOrder = require("../../Acc-config/place-order.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  (Swipers + Img + Purchase + Login + Specs + BackTop)();
}
const Swipers = () => "./component/swiper.js";
const Img = () => "./component/image.js";
const Purchase = () => "./component/purchase.js";
const Login = () => "../components/login-view.js";
const Specs = () => "../components/specs-gift-view.js";
const BackTop = () => "../Common-component/UI/BackTop.js";
const _sfc_main = {
  __name: "details",
  setup(__props) {
    const search_data = common_vendor.reactive({
      tab_name: ["商品", "详情"],
      S_height: 0,
      S_top: 0,
      S_width: 0,
      Custom_height: 0,
      being: true,
      //显隐藏tab
      styleOpacity: 0,
      //tab透明度
      trigger: 0
    });
    common_vendor.toRefs(search_data);
    common_vendor.onMounted(() => {
      const but_data = common_vendor.wx$1.getMenuButtonBoundingClientRect();
      search_data.S_height = but_data.height;
      search_data.S_top = but_data.top;
      search_data.S_width = but_data.width;
      search_data.Custom_height = but_data.height + but_data.top;
    });
    let heightset = common_vendor.reactive({ hei: [] });
    function viewheight() {
      const query = common_vendor.wx$1.createSelectorQuery();
      query.selectAll("#select").boundingClientRect();
      query.exec((res) => {
        heightset.hei.push(res[0][0].height - search_data.Custom_height);
        heightset.hei.push(heightset.hei[1] + res[0][1].height + 20);
      });
    }
    common_vendor.onPageScroll((e) => {
      console.log("onPageScroll", e);
      search_data.styleOpacity = e.scrollTop / 300;
      search_data.being = e.scrollTop === 0 ? false : true;
      let scrollTop = e.scrollTop;
      if (scrollTop >= heightset.hei[search_data.trigger]) {
        search_data.trigger += 1;
      } else if (scrollTop < heightset.hei[search_data.trigger - 1]) {
        search_data.trigger -= 1;
      }
    });
    common_vendor.onBeforeUnmount(() => {
      AccConfig_placeOrder.ORDER.order.specs = [];
      AccConfig_placeOrder.ORDER.order.SPECE_STR = "";
    });
    const db = common_vendor.wx$1.cloud.database();
    const result = common_vendor.reactive({
      goods_id: "",
      goods: [],
      collection: 0,
      login_coll: 0,
      sku_data: [],
      seckill: [],
      login_cart: 0,
      eav_num: 0,
      eav_data: []
    });
    const { goods_id, goods, seckill, eav_num, eav_data, collection, sku_data } = common_vendor.toRefs(result);
    common_vendor.onLoad((event) => {
      result.goods_id = event.goods_id;
      const goods2 = db.collection("goods").doc(event.goods_id).get();
      const collect = db.collection("collect_goods").where({ goods_id: event.goods_id }).get();
      const sku_data_a = db.collection("sku_data").where({ sku_id: event.goods_id }).field({ sku: true }).get();
      const seckill2 = db.collection("seckill").where({ goods_id: event.goods_id }).field({ ori_price: true, price_spike: true, seckill_time: true }).get();
      const nu_sh_cart = db.collection("sh_cart").count();
      const eav_num2 = db.collection("goods_eva").where({ goods_id: event.goods_id }).count();
      const eav_data2 = db.collection("goods_eva").where({ goods_id: event.goods_id }).limit(3).get();
      const user = common_vendor.wx$1.getStorageSync("user_infor");
      Promise.all([goods2, collect, sku_data_a, seckill2, nu_sh_cart, eav_num2, eav_data2]).then(async (res) => {
        var _a, _b, _c, _d;
        await common_vendor.nextTick$1();
        console.log(res);
        result.goods = res[0].data;
        result.collection = user ? (_a = res[1].data) == null ? void 0 : _a.length : 0;
        result.login_coll = (_b = res[1].data) == null ? void 0 : _b.length;
        result.sku_data = res[2].data;
        result.seckill = res[3].data;
        AccConfig_placeOrder.ORDER.nu_sh_cart = user ? res[4].total : 0;
        result.login_cart = res[4].total;
        result.eav_num = res[5].total;
        result.eav_data = res[6].data;
        AccConfig_placeOrder.ORDER.order.goods_id = res[0].data._id;
        AccConfig_placeOrder.ORDER.order.goods_image = res[0].data.goods_cover;
        AccConfig_placeOrder.ORDER.order.goods_title = res[0].data.goods_title;
        if (((_c = result.sku_data) == null ? void 0 : _c.length) === 0 && ((_d = result.seckill) == null ? void 0 : _d.length) === 0) {
          AccConfig_placeOrder.ORDER.order.goods_price = res[0].data.goods_price;
        }
        setTimeout(() => {
          viewheight();
        }, 900);
      }).catch((err) => {
        console.log(err);
      });
    });
    common_vendor.watch(() => AccConfig_answer.login_user.response, (newVal, oldVal) => {
      result.collection = result.login_coll;
      AccConfig_placeOrder.ORDER.nu_sh_cart = result.login_cart;
    });
    common_vendor.onShareAppMessage(() => {
      return {
        title: result.goods.goods_title,
        path: `/pages/Gift-details/details?goods_id=${result.goods_id}`,
        imageUrl: result.goods.goods_cover
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(goods)
      }, common_vendor.unref(goods) ? {
        b: common_vendor.p({
          id: "select",
          goods: common_vendor.unref(goods),
          seckill: common_vendor.unref(seckill)
        })
      } : {}, {
        c: common_vendor.p({
          id: "select",
          goods_details: common_vendor.unref(goods).goods_details
        }),
        d: common_vendor.p({
          goods_id: common_vendor.unref(goods_id),
          collection: common_vendor.unref(collection),
          sku_data: common_vendor.unref(sku_data),
          goods: common_vendor.unref(goods)
        }),
        e: common_vendor.p({
          sku_data: common_vendor.unref(sku_data),
          goods: common_vendor.unref(goods)
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Gift-details/details.vue"]]);
wx.createPage(MiniProgramPage);
