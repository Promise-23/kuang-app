"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_kuaidi = require("../../Acc-config/kuaidi.js");
const _sfc_main = {
  __name: "tracking",
  setup(__props) {
    const data_goods = common_vendor.reactive({ waybill_No: "", goods_image: "", goods_title: "", buy_amount: 0 });
    const { waybill_No, goods_image, goods_title, buy_amount } = common_vendor.toRefs(data_goods);
    common_vendor.onLoad((event) => {
      let res_v = JSON.parse(event.value);
      data_goods.waybill_No = res_v.waybill_No;
      data_goods.goods_image = res_v.goods_image;
      data_goods.goods_title = res_v.goods_title;
      data_goods.buy_amount = res_v.buy_amount;
      post();
    });
    function getParams() {
      let param = { com: "", num: data_goods.waybill_No };
      let md = common_vendor.md5(JSON.stringify(param) + AccConfig_kuaidi.KEY + AccConfig_kuaidi.CUSTOMER).toUpperCase();
      let obj = { customer: AccConfig_kuaidi.CUSTOMER, sign: md, param: JSON.stringify(param) };
      return obj;
    }
    const data = common_vendor.reactive({ nu: "", state: 0, kuaidi: "", logo: "", progress: [], message: 0 });
    const { nu, state, kuaidi, logo, progress, message } = common_vendor.toRefs(data);
    function post() {
      common_vendor.index.request({
        url: AccConfig_kuaidi.URL,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: getParams()
      }).then((res) => {
        console.log(res);
        if (res.data.message == "ok") {
          data.nu = res.data.nu;
          data.state = res.data.state;
          const K_name = AccConfig_kuaidi.KUAIDI.filter((item) => item.com == res.data.com);
          data.kuaidi = K_name[0].name;
          data.logo = K_name[0].logo;
          data.progress = res.data.data;
        } else {
          data.message = 1;
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(goods_image),
        b: common_vendor.t(common_vendor.unref(goods_title)),
        c: common_vendor.t(common_vendor.unref(buy_amount)),
        d: common_vendor.unref(logo),
        e: common_vendor.t(common_vendor.unref(kuaidi)),
        f: common_vendor.t(common_vendor.unref(nu)),
        g: common_vendor.f(common_vendor.unref(progress), (item, index, i0) => {
          return common_vendor.e({
            a: index == 0 && common_vendor.unref(state) == "3"
          }, index == 0 && common_vendor.unref(state) == "3" ? {} : {}, {
            b: common_vendor.t(item.context),
            c: common_vendor.n(index == 0 && common_vendor.unref(state) == "3" ? "active-text" : ""),
            d: common_vendor.t(item.time),
            e: index
          });
        }),
        h: common_vendor.unref(message) == 1
      }, common_vendor.unref(message) == 1 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5471d0b2"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Order-tracking/tracking.vue"]]);
wx.createPage(MiniProgramPage);
