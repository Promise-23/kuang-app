"use strict";
const common_vendor = require("../common/vendor.js");
const search_data = common_vendor.reactive({
  S_height: 0,
  S_top: 0,
  S_left: 0,
  Custom_height: 0
});
let login_user = common_vendor.reactive({ show: false, response: "fail" });
let comment_show = common_vendor.reactive({ show: false, num: 1, goods_id: "" });
let sku_popup = common_vendor.reactive({ show: false, judge: "" });
let address_show = common_vendor.reactive({ show: false });
let modify = common_vendor.reactive({ data: [], id: "" });
let deci = common_vendor.ref("001");
let new_address = common_vendor.reactive({ data: [] });
let eav_index = common_vendor.ref("01");
let myCoupons = common_vendor.reactive({ data: [], hasCouponId: [] });
let myIntegral = common_vendor.reactive({ data: [], count: 0 });
exports.address_show = address_show;
exports.comment_show = comment_show;
exports.deci = deci;
exports.eav_index = eav_index;
exports.login_user = login_user;
exports.modify = modify;
exports.myCoupons = myCoupons;
exports.myIntegral = myIntegral;
exports.new_address = new_address;
exports.search_data = search_data;
exports.sku_popup = sku_popup;
