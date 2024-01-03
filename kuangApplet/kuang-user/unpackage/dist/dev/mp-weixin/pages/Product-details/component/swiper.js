"use strict";
const common_vendor = require("../../../common/vendor.js");
const AccConfig_placeOrder = require("../../../Acc-config/place-order.js");
const AccConfig_answer = require("../../../Acc-config/answer.js");
const _sfc_main = {
  __name: "swiper",
  props: { goods: Object, seckill: Array },
  setup(__props) {
    const props = __props;
    const { S_height, S_top, S_left, Custom_height } = common_vendor.toRefs(AccConfig_answer.search_data);
    const ban_length = common_vendor.ref(0);
    const current = common_vendor.ref(1);
    function changeCurrent(e) {
      current.value = e.detail.current + 1;
    }
    const seckill_display = common_vendor.ref(false);
    common_vendor.watch(props, (newVla_a, oldVal) => {
      var _a, _b;
      const newVla = JSON.parse(JSON.stringify(newVla_a));
      ban_length.value = ((_b = (_a = newVla == null ? void 0 : newVla.goods) == null ? void 0 : _a.goods_banner) == null ? void 0 : _b.length) ?? 0;
      if (newVla.seckill.length === 0) {
        seckill_display.value = false;
        AccConfig_placeOrder.ORDER.order.goods_price = newVla.goods.goods_price;
        AccConfig_placeOrder.ORDER.exist = false;
      } else {
        let start_Time = newVla.seckill[0].seckill_time.start_Time;
        let end_Time = newVla.seckill[0].seckill_time.end_Time;
        if (start_Time > currentTime()) {
          console.log("有秒杀未开始");
          seckill_display.value = false;
          AccConfig_placeOrder.ORDER.order.goods_price = newVla.goods.goods_price;
          AccConfig_placeOrder.ORDER.exist = false;
        } else {
          console.log("有秒杀已开始");
          counTdown(newVla.seckill[0], end_Time);
        }
      }
    });
    function currentTime() {
      return Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3);
    }
    const result = common_vendor.reactive({ day: "00", hour: "00", minute: "00", second: "00" });
    const { day, hour, minute, second } = common_vendor.toRefs(result);
    function counTdown(seckill_pri, end_Time) {
      let timer = setInterval(() => {
        let sur = end_Time - currentTime();
        let DD = parseInt(sur / 60 / 60 / 24, 10);
        let HH = parseInt(sur / 60 / 60 % 24, 10);
        let MM = parseInt(sur / 60 % 60, 10);
        let SS = parseInt(sur % 60, 10);
        DD = checkTime(DD);
        HH = checkTime(HH);
        MM = checkTime(MM);
        SS = checkTime(SS);
        if (sur > 0) {
          seckill_display.value = true;
          AccConfig_placeOrder.ORDER.order.goods_price = seckill_pri.price_spike;
          AccConfig_placeOrder.ORDER.exist = true;
          result.day = DD;
          result.hour = HH;
          result.minute = MM;
          result.second = SS;
        } else {
          console.log("秒杀结束");
          seckill_display.value = false;
          AccConfig_placeOrder.ORDER.order.goods_price = seckill_pri.ori_price;
          AccConfig_placeOrder.ORDER.exist = false;
          clearInterval(timer);
        }
      }, 1e3);
      clear_time.value = timer;
      function checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }
    }
    let clear_time = common_vendor.ref("");
    common_vendor.onBeforeUnmount(() => {
      clearInterval(clear_time.value);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.s("height:" + common_vendor.unref(S_top) + "px;"),
        b: common_vendor.f(__props.goods.goods_banner, (item, index, i0) => {
          return {
            a: item.image,
            b: index
          };
        }),
        c: common_vendor.o(changeCurrent),
        d: common_vendor.t(current.value),
        e: common_vendor.t(ban_length.value),
        f: seckill_display.value
      }, seckill_display.value ? common_vendor.e({
        g: common_vendor.t(__props.goods.sold),
        h: common_vendor.t(__props.seckill[0].price_spike),
        i: common_vendor.t(__props.seckill[0].ori_price),
        j: common_vendor.unref(day) != "00"
      }, common_vendor.unref(day) != "00" ? {
        k: common_vendor.t(common_vendor.unref(day))
      } : {}, {
        l: common_vendor.unref(day) != "00"
      }, common_vendor.unref(day) != "00" ? {} : {}, {
        m: common_vendor.t(common_vendor.unref(hour)),
        n: common_vendor.t(common_vendor.unref(minute)),
        o: common_vendor.t(common_vendor.unref(second))
      }) : {
        p: common_vendor.t(__props.goods.goods_price),
        q: common_vendor.t(__props.goods.sold)
      }, {
        r: common_vendor.t(__props.goods.goods_title)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3c116fde"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Product-details/component/swiper.vue"]]);
wx.createComponent(Component);
