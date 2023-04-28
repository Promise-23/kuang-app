"use strict";
const common_vendor = require("../common/vendor.js");
const AccConfig_date = require("./date.js");
common_vendor.hooks.locale("zh-cn");
let current = () => {
  const C_year = common_vendor.hooks().format("YYYY");
  const C_month = common_vendor.hooks().format("M");
  const C_day = common_vendor.hooks().format("D");
  const N_year = common_vendor.hooks().add(1, "year").format("YYYY");
  AccConfig_date.start_date[0] = [{ time: C_year, name: C_year + "年" }, { time: N_year, name: N_year + "年" }];
  AccConfig_date.end_date[0] = [{ time: C_year, name: C_year + "年" }, { time: N_year, name: N_year + "年" }];
  for (let w = C_month; w <= 12; w++) {
    AccConfig_date.start_date[1].push({ time: Number(w), name: w + "月" });
    AccConfig_date.end_date[1].push({ time: Number(w), name: w + "月" });
  }
  const Days = common_vendor.hooks(C_year + "/" + C_month, "YYYY/M").daysInMonth();
  for (let i = C_day; i <= Days; i++) {
    AccConfig_date.start_date[2].push({ time: Number(i), name: i + "日" });
    AccConfig_date.end_date[2].push({ time: Number(i), name: i + "日" });
  }
};
let months = (years) => {
  const C_month = common_vendor.hooks().format("M");
  const N_year = common_vendor.hooks().add(1, "year").format("YYYY");
  let MONTH = years == N_year ? 1 : C_month;
  let mohth_data = [];
  for (let w = Number(MONTH); w <= 12; w++) {
    mohth_data.push({ time: Number(w), name: w + "月" });
  }
  return mohth_data;
};
let codays = (years) => {
  const C_year = common_vendor.hooks().format("YYYY");
  const C_month = common_vendor.hooks().format("M");
  const C_day = common_vendor.hooks().format("D");
  let INIT = years.year == C_year && years.month == C_month ? C_day : 1;
  const new_data = [];
  const Days = common_vendor.hooks(years.year + "/" + years.month, "YYYY/M").daysInMonth();
  for (let i = Number(INIT); i <= Days; i++) {
    new_data.push({ time: Number(i), name: i + "日" });
  }
  return new_data;
};
exports.codays = codays;
exports.current = current;
exports.months = months;
