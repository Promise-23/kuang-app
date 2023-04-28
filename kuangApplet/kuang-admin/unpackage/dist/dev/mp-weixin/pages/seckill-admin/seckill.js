"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_init = require("../../Acc-config/init.js");
const AccConfig_date = require("../../Acc-config/date.js");
const AccConfig_caTime = require("../../Acc-config/ca-time.js");
const AccConfig_media = require("../../Acc-config/media.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const _sfc_main = {
  __name: "seckill",
  setup(__props) {
    AccConfig_caTime.current();
    const show = common_vendor.ref(false);
    const data = common_vendor.reactive({ seckill_goods: [] });
    common_vendor.onMounted(() => {
      getSeckill();
    });
    async function getSeckill() {
      let DB = await AccConfig_init.inIt();
      let res = await DB.database().collection("seckill").get();
      console.log(res);
      data.seckill_goods = res.data;
    }
    const Time = common_vendor.reactive({
      start_arr: AccConfig_date.start_date,
      end_arr: AccConfig_date.end_date,
      multiIndex_a: [0, 0, 0, 0, 0],
      //开始时间value 每一项的值
      multiIndex_b: [0, 0, 0, 0, 0],
      //结束时间value 每一项的值
      se_cover: "",
      //封面图
      se_title: "",
      //标题
      se_price: "",
      //秒杀价格
      start: "",
      //开始时间
      end: "",
      //结束时间
      re_goods: {
        title: "",
        //关联的商品标题
        goods_id: "",
        //关联的商品id
        video_url: "",
        //关联的商品短视频
        ori_price: ""
        //关联的商品原价
      },
      years: [{ "year": AccConfig_date.start_date[0][0].time, "month": AccConfig_date.start_date[1][0].time }],
      ban: false
      //判断设置的秒杀时间是否正确
    });
    async function upImage() {
      const local = await new AccConfig_media.Upload().image();
      common_vendor.wx$1.showLoading({ title: "正在上传", mask: true });
      const res = await new AccConfig_media.Upload().cloud(local[0].tempFilePath);
      Time.se_cover = res;
      common_vendor.wx$1.hideLoading();
    }
    function colStart(event) {
      const RES = event.detail;
      shAre(RES, Time.start_arr, Time.multiIndex_a);
    }
    function colEnd(event) {
      const RES = event.detail;
      shAre(RES, Time.end_arr, Time.multiIndex_b);
    }
    function shAre(RES, to_date, mult, val) {
      console.log("修改的列为：" + RES.column + "，值为：" + RES.value);
      mult[RES.column] = RES.value;
      switch (RES.column) {
        case 0:
          switch (mult[0]) {
            case 0:
              to_date[1] = AccConfig_caTime.months(to_date[0][0].time);
              to_date[2] = AccConfig_caTime.codays({ year: to_date[0][0].time, month: to_date[1][0].time });
              break;
            case 1:
              to_date[1] = AccConfig_caTime.months(to_date[0][1].time);
              to_date[2] = AccConfig_caTime.codays({ year: to_date[0][1].time, month: -1 });
              break;
          }
          mult.splice(1, 1, 0);
          mult.splice(2, 1, 0);
          mult.splice(3, 1, 0);
          mult.splice(4, 1, 0);
          break;
        case 1:
          let MO = mult;
          to_date[2] = AccConfig_caTime.codays({ year: to_date[0][MO[0]].time, month: to_date[1][MO[1]].time });
          mult.splice(2, 1, 0);
          mult.splice(3, 1, 0);
          mult.splice(4, 1, 0);
          break;
      }
    }
    function changeStart(e) {
      const RES = e.detail.value;
      conFirm(RES, "start", Time.start_arr);
    }
    function changeEnd(e) {
      const RES = e.detail.value;
      conFirm(RES, "end", Time.end_arr);
    }
    function conFirm(RES, val, date) {
      const year = date[0][RES[0]].time;
      const month = date[1][RES[1]].time;
      const day = date[2][RES[2]].time;
      const time = date[3][RES[3]].time;
      const minute = date[4][RES[4]].time;
      const sele_res = year + "/" + month + "/" + day + " " + time + ":" + minute + ":00";
      if (val == "start") {
        Time.start = sele_res;
        Time.multiIndex_a = RES;
      } else {
        Time.end = sele_res;
        Time.multiIndex_b = RES;
      }
    }
    common_vendor.hooks.locale("zh-cn");
    common_vendor.watch([() => Time.start, () => Time.end], (newVal, oldVal) => {
      if (newVal[0] != "" && newVal[1] != "") {
        const start = common_vendor.hooks(newVal[0], "YYYY/MM/DD hh:mm:ss").unix();
        const end = common_vendor.hooks(newVal[1], "YYYY/MM/DD hh:mm:ss").unix();
        if (start >= end) {
          Time.end = "结束时间早已开始时间";
          Time.ban = false;
        } else if (start < end) {
          Time.ban = true;
        }
      }
    });
    function addTo() {
      const rel_id = data.seckill_goods.map((item) => item.goods_id);
      const str_id = JSON.stringify(rel_id);
      common_vendor.wx$1.navigateTo({
        url: "/pages/goods-list/list?ref_id=" + str_id
      });
    }
    common_vendor.watch(AccConfig_answer.select_goods, (newVal, oldVal) => {
      Time.re_goods.title = newVal.goods_title;
      Time.re_goods.goods_id = newVal.goods_id;
      Time.re_goods.video_url = newVal.video_url;
      Time.re_goods.ori_price = newVal.goods_price;
    });
    function subMit() {
      switch (true) {
        case Time.se_cover == "":
          new AccConfig_media.Feedback("请上传封面图", "none").toast();
          break;
        case Time.se_title == "":
          new AccConfig_media.Feedback("请输入标题", "none").toast();
          break;
        case Time.se_price == "":
          new AccConfig_media.Feedback("请输入秒杀价", "none").toast();
          break;
        case (Time.start == "" || Time.end == ""):
          new AccConfig_media.Feedback("请设置秒杀时间", "none").toast();
          break;
        case Time.ban == false:
          new AccConfig_media.Feedback("结束时间早已开始时间", "none").toast();
          break;
        case Time.re_goods.goods_id == "":
          new AccConfig_media.Feedback("请关联一个商品", "none").toast();
          break;
        default:
          database();
      }
    }
    async function database() {
      common_vendor.wx$1.showLoading({ title: "正在提交", mask: true });
      const start_Time = common_vendor.hooks(Time.start, "YYYY/MM/DD hh:mm:ss").unix();
      const end_Time = common_vendor.hooks(Time.end, "YYYY/MM/DD hh:mm:ss").unix();
      let obj = {
        cover: Time.se_cover,
        title: Time.se_title,
        ori_price: Time.re_goods.ori_price,
        price_spike: Number(Time.se_price),
        seckill_time: { start_Time, end_Time },
        goods_id: Time.re_goods.goods_id,
        video_url: Time.re_goods.video_url
      };
      try {
        let DB = await AccConfig_init.inIt();
        await DB.database().collection("seckill").add({ data: obj });
        await DB.database().collection("goods").doc(Time.re_goods.goods_id).update({ data: { seckill: true } });
        show.value = false;
        getSeckill();
        new AccConfig_media.Feedback("提交成功", "success").toast();
        Time.se_cover = "";
        Time.se_title;
        Time.se_price = "";
        Time.start = "";
        Time.end = "";
        Time.re_goods.title = "";
      } catch (e) {
        new AccConfig_media.Feedback("提交失败").toast();
      }
    }
    async function deLete(id, index) {
      try {
        let DB = await AccConfig_init.inIt();
        await DB.database().collection("seckill").doc(id).remove();
        data.seckill_goods.splice(index, 1);
        new AccConfig_media.Feedback("删除成功", "success").toast();
      } catch (e) {
        new AccConfig_media.Feedback("删除失败").toast();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: data.seckill_goods.length > 0
      }, data.seckill_goods.length > 0 ? {} : {}, {
        b: common_vendor.f(data.seckill_goods, (item, index, i0) => {
          return {
            a: item.cover,
            b: common_vendor.t(item.title),
            c: common_vendor.o(($event) => deLete(item._id, index), index),
            d: index
          };
        }),
        c: data.seckill_goods.length == 0
      }, data.seckill_goods.length == 0 ? {} : {}, {
        d: common_vendor.o(($event) => show.value = true),
        e: common_vendor.o(($event) => show.value = false),
        f: common_vendor.o(subMit),
        g: Time.se_cover == ""
      }, Time.se_cover == "" ? {
        h: common_vendor.o(upImage)
      } : {}, {
        i: Time.se_cover,
        j: Time.se_cover != ""
      }, Time.se_cover != "" ? {
        k: common_vendor.o(($event) => Time.se_cover = "")
      } : {}, {
        l: Time.se_title,
        m: common_vendor.o(($event) => Time.se_title = $event.detail.value),
        n: Time.se_price,
        o: common_vendor.o(($event) => Time.se_price = $event.detail.value),
        p: common_vendor.t(Time.start),
        q: Time.start_arr,
        r: Time.multiIndex_a,
        s: common_vendor.o(colStart),
        t: common_vendor.o(changeStart),
        v: common_vendor.t(Time.end),
        w: Time.end_arr,
        x: Time.multiIndex_b,
        y: common_vendor.o(colEnd),
        z: common_vendor.o(changeEnd),
        A: common_vendor.t(Time.re_goods.title == "" ? "添加" : Time.re_goods.title),
        B: common_vendor.o(addTo),
        C: show.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3d30ce32"], ["__file", "D:/hujie/Applet/kuangApplet/kuang-admin/pages/seckill-admin/seckill.vue"]]);
wx.createPage(MiniProgramPage);
