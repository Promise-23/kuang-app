"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_init = require("../../Acc-config/init.js");
const AccConfig_date = require("../../Acc-config/date.js");
const AccConfig_caTime = require("../../Acc-config/ca-time.js");
const AccConfig_media = require("../../Acc-config/media.js");
if (!Math) {
  (Coupon + Loading)();
}
const Loading = () => "../public-view/loading.js";
const Coupon = () => "./components/Coupon.js";
const _sfc_main = {
  __name: "coupon",
  setup(__props) {
    var _a, _b;
    AccConfig_caTime.current();
    const show = common_vendor.ref(false);
    const data = common_vendor.reactive({ coupons: [] });
    const { coupons } = common_vendor.toRefs(data);
    common_vendor.onMounted(() => {
      getCoupons();
      getSortArray();
      console.log("start_date", AccConfig_date.start_date);
      console.log("end_date", AccConfig_date.end_date);
    });
    async function getCoupons() {
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("coupon_center").where({ active: true }).limit(10).field({ _openid: false }).get();
      console.log("getCoupons", res == null ? void 0 : res.data);
      data.coupons = (res == null ? void 0 : res.data) ?? [];
    }
    const initData = { desc: "", price: "", num: "", type: "full", limit: [], remark: "", time: [] };
    const formData = common_vendor.reactive(initData);
    async function subMit() {
      if (!validateDesc() || !validatePrice() || !validateFull() || !validateNum() || !validateTime()) {
        return false;
      }
      let DB = await AccConfig_init.inIt();
      let res = await DB.database().collection("coupon_center").add({ data: { ...formData, active: true, getNum: 0 } });
      data.coupons.push({ ...formData, _id: res._id });
      Object.assign(formData, initData);
      console.log("formData", formData);
      show.value = false;
    }
    let page_n = common_vendor.ref(0);
    let loading = common_vendor.ref(false);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("coupon_center").where({ active: true }).limit(10).skip(sk).field({ _openid: false }).get();
      let merge = [...data.coupons, ...res.data];
      let obj = {};
      let new_data = merge.reduce((prev, item) => {
        if (!obj[item._id]) {
          prev.push(item);
          obj[item._id] = true;
        }
        return prev;
      }, []);
      data.coupons = new_data;
      loading.value = false;
    });
    async function deLete(id, index) {
      console.log("deLete", id, index);
      try {
        let DB = await AccConfig_init.inIt();
        await DB.database().collection("coupon_center").doc(id).update({ data: { active: false } });
        data.coupons.splice(index, 1);
        new AccConfig_media.Feedback("删除成功").toast();
      } catch (e) {
        new AccConfig_media.Feedback("删除失败").toast();
      }
    }
    const couponTypes = [{ label: "满减券", value: "full" }, { label: "支付券", value: "pay" }, { label: "商品券", value: "limit" }];
    function radioTypeChange(e) {
      console.log("radioChange", e);
      formData.type = e.target.value;
    }
    function validateDesc() {
      if (formData.desc == "") {
        new AccConfig_media.Feedback("请输入优惠券描述", "none").toast();
        return false;
      } else {
        return true;
      }
    }
    function validatePrice() {
      console.log("formData.price", typeof formData.price);
      if (formData.price == "") {
        new AccConfig_media.Feedback("请输入优惠券金额", "none").toast();
        return false;
      } else {
        return true;
      }
    }
    function validateFull() {
      if (formData.type !== "full") {
        return true;
      }
      if (formData.full == "") {
        new AccConfig_media.Feedback("请输入满多少可用", "none").toast();
        return false;
      } else if (formData.full < formData.price * 2) {
        new AccConfig_media.Feedback("当前优惠券折扣过低", "none").toast();
        return false;
      } else {
        return true;
      }
    }
    function validateNum() {
      if (formData.num == "") {
        new AccConfig_media.Feedback("请输入可领取数量", "none").toast();
        return false;
      } else {
        return true;
      }
    }
    function validateTime() {
      console.log("validateTime", formData.time);
      if (formData.time.length == 0 || !formData.time[0]) {
        new AccConfig_media.Feedback("请输入生效开始时间", "none").toast();
        return false;
      } else if (!formData.time[1]) {
        new AccConfig_media.Feedback("请输入生效结束时间", "none").toast();
        return false;
      } else {
        return true;
      }
    }
    const sortdata = common_vendor.reactive({ sortArray: [], sort_value: "" });
    const { sortArray, sort_value } = common_vendor.toRefs(sortdata);
    async function getSortArray() {
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("goods_sort").field({ _openid: false }).get();
      sortdata.sortArray = res.data;
      console.log("sortdata.sortArray", sortdata.sortArray);
    }
    function changeSort(e) {
      sortdata.sort_value = sortdata.sortArray[e.detail.value].sort_name;
      formData.limit = [sortdata.sort_value];
      console.log("changeSort", sortdata.sort_value);
    }
    const Time = common_vendor.reactive({
      start_arr: AccConfig_date.start_date.slice(0, 3),
      end_arr: AccConfig_date.end_date.slice(0, 3),
      multiIndex_a: [0, 0, 0, 0, 0],
      //开始时间value 每一项的值
      multiIndex_b: [0, 0, 0, 0, 0],
      //结束时间value 每一项的值
      start: "",
      //开始时间
      end: "",
      //结束时间
      years: [{ "year": (_a = AccConfig_date.start_date[0][0]) == null ? void 0 : _a.time, "month": (_b = AccConfig_date.start_date[1][0]) == null ? void 0 : _b.time }],
      ban: false
      //判断设置的秒杀时间是否正确
    });
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
      const sele_res = year + "-" + month + "-" + day;
      if (val == "start") {
        Time.start = sele_res;
        Time.multiIndex_a = RES;
        formData.time[0] = sele_res;
      } else {
        Time.end = sele_res;
        Time.multiIndex_b = RES;
        formData.time[1] = sele_res;
      }
      console.log("sele_res", sele_res);
      console.log("RES", RES);
    }
    common_vendor.hooks.locale("zh-cn");
    common_vendor.watch([() => Time.start, () => Time.end], (newVal, oldVal) => {
      if (newVal[0] != "" && newVal[1] != "") {
        const start = common_vendor.hooks(newVal[0], "YYYY-MM-DD").unix();
        const end = common_vendor.hooks(newVal[1], "YYYY-MM-DD").unix();
        if (start >= end) {
          Time.end = "结束时间不可早于开始时间";
          Time.ban = false;
        } else if (start < end) {
          Time.ban = true;
        }
      }
    });
    common_vendor.watchEffect(() => {
      var _a2;
      if (formData.type == "full" && formData.full) {
        formData.remark = "消费满" + formData.full + "元可用";
      } else if (formData.type == "limit" && ((_a2 = formData.limit) == null ? void 0 : _a2.length) > 0) {
        console.log("formData.limit", formData.limit.join("、"));
        formData.remark = "仅限" + formData.limit.join("、") + "类商品可用";
      } else {
        formData.remark = "仅线上购物可用";
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(coupons), (item, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(deLete, index),
            c: "23d75001-0-" + i0,
            d: common_vendor.p({
              index,
              coupon: item
            })
          };
        }),
        b: common_vendor.unref(coupons).length === 0
      }, common_vendor.unref(coupons).length === 0 ? {} : {}, {
        c: common_vendor.o(($event) => show.value = false),
        d: common_vendor.o(validateDesc),
        e: formData.desc,
        f: common_vendor.o(($event) => formData.desc = $event.detail.value),
        g: common_vendor.o(validatePrice),
        h: formData.price,
        i: common_vendor.o(($event) => formData.price = $event.detail.value),
        j: common_vendor.o(validateFull),
        k: formData.full,
        l: common_vendor.o(($event) => formData.full = $event.detail.value),
        m: formData.type == "full",
        n: common_vendor.o(validateNum),
        o: formData.num,
        p: common_vendor.o(($event) => formData.num = $event.detail.value),
        q: common_vendor.t(common_vendor.unref(sort_value)),
        r: common_vendor.unref(sortArray),
        s: common_vendor.o(changeSort),
        t: formData.type == "limit",
        v: common_vendor.f(couponTypes, (item, index, i0) => {
          return {
            a: item.value,
            b: item.value === formData.type,
            c: common_vendor.t(item.label),
            d: item.value
          };
        }),
        w: common_vendor.o(radioTypeChange),
        x: common_vendor.t(Time.start),
        y: Time.start_arr,
        z: Time.multiIndex_a,
        A: common_vendor.o(colStart),
        B: common_vendor.o(changeStart),
        C: common_vendor.t(Time.end),
        D: Time.end_arr,
        E: Time.multiIndex_b,
        F: common_vendor.o(colEnd),
        G: common_vendor.o(changeEnd),
        H: formData.remark,
        I: common_vendor.o(($event) => formData.remark = $event.detail.value),
        J: common_vendor.o(subMit),
        K: show.value,
        L: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        M: common_vendor.o(($event) => show.value = true)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-23d75001"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-admin/pages/coupon-manage/coupon.vue"]]);
wx.createPage(MiniProgramPage);
