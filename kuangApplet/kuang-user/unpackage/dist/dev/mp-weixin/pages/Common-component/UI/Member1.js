"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
const _sfc_main = {
  __name: "Member1",
  props: { style: Object },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          d: "M1348.570074 433.664h53.864296v19.702519h-53.864296zM1348.570074 489.28237h53.864296v19.000889h-53.864296zM1447.414519 489.28237h49.682962v19.000889h-49.682962z",
          fill: "#393D49",
          ["p-id"]: "2456"
        }),
        b: common_vendor.p({
          d: "M2281.851259 190.369185H487.68c100.437333 51.2 163.726222 154.358519 163.858963 267.093334-0.028444 79.758222-31.829333 156.22637-88.348444 212.498962a302.096119 302.096119 0 0 1-213.248 88.026075c-34.531556-0.075852-68.788148-6.07763-101.300149-17.739852a301.230459 301.230459 0 0 0 168.324741 51.133629h1864.884148c166.570667 0 301.596444-134.542222 301.596445-300.534518s-135.025778-300.47763-301.596445-300.47763z m-331.65274 143.056593h305.265777v63.383703c0 6.817185-1.052444 13.198222-3.147852 19.143112-2.095407 5.944889-5.650963 11.282963-10.666666 16.023703-5.015704 4.731259-15.559111 7.10163-31.649185 7.10163h-259.802074V333.425778z m0 122.377481h305.265777v126.046815h-48.810666v-88.737185h-207.634963v88.737185h-48.810667V455.803259z m-360.002371-61.714963h29.11763c7.670519 0 12.724148-1.109333 15.17037-3.328 2.436741-2.218667 4.589037-5.025185 6.447408-8.410074l27.373037-51.361185h156.378074l24.576 46.373926c3.365926 6.580148 6.504296 10.789926 9.415111 12.61037 2.901333 1.820444 8.485926 2.730667 16.734815 2.730667h22.66074v37.30963h-41.140148c-11.273481 0-19.465481-1.194667-24.585481-3.574519-5.12-2.379852-9.765926-7.120593-13.94726-14.212741l-26.149925-43.927703h-87.343408l-27.894518 45.330963c-4.41837 7.092148-9.528889 11.823407-15.341037 14.21274-5.812148 2.379852-13.596444 3.574519-23.362371 3.574519h-48.118518v-37.328593zM1236.992 330.808889h51.427556v53.522963h-51.427556V330.808889z m-64.151704 284.340148c0 8.599704-2.721185 16.877037-8.163555 24.841482-5.44237 7.964444-16.791704 11.946667-34.048 11.946666H884.318815V503.220148h288.521481v111.928889z m12.724148-232.220444H1088.113778v73.045333H1185.564444v35.915852H871.414519v-35.915852h99.195259v-73.045333h-93.269334V347.022222h29.458963v-17.256296h39.746371l17.607111 17.256296h128.663704l21.968592-19.181037h41.841778V347.022222h28.937481v35.906371z m-5.224296 8.372148l-19.873185 32.777481c-4.532148 7.319704-9.14963 12.174222-13.861926 14.554074-4.702815 2.379852-11.245037 3.574519-19.617185 3.574519h-23.182222v-33.991111h8.893629c3.13837 0 6.039704-0.654222 8.713482-1.972148 2.673778-1.308444 7.319704-6.295704 13.947259-14.942815h44.980148z m-294.286222 0h45.150815c3.489185 5.575111 7.205926 10.107259 11.159703 13.596444 3.953778 3.489185 10.287407 4.939852 19.000889 4.361482v32.948148h-19.873185c-14.061037 0-23.333926-1.592889-27.809185-4.79763-4.475259-3.195259-8.106667-7.642074-10.894222-13.340444l-16.734815-32.768z m653.586963 260.456296H1319.803259c-11.159704 0-18.944-1.877333-23.36237-5.632l-15.17037-11.083852c-3.024593 3.991704-6.599111 7.888593-10.723556 11.700148-4.124444 3.811556-11.017481 5.717333-20.660148 5.717334h-21.266963v-37.30963h8.372148c2.673778 0 4.532148-0.758519 5.575111-2.266074 1.042963-1.517037 1.564444-6.637037 1.564445-15.378963V442.036148H1229.842963v-44.278518h59.278222V576.474074c0 5.461333 0.720593 10.68563 2.180741 15.68237 1.450667 4.996741 4.446815 10.078815 8.978963 15.246223 4.532148 5.167407 13.653333 7.74637 27.373037 7.74637h211.986963v36.608z m0.872296-291.233185l-31.55437 37.233778h30.511407v149.010963c0 10.81837-1.024 19.105185-3.062518 24.860444s-5.584593 11.510519-10.638223 17.275259c-5.044148 5.755259-12.619852 8.63763-22.717629 8.63763h-39.424v-35.915852h23.36237c3.602963 0 6.191407-0.654222 7.755852-1.953185s2.351407-3.678815 2.351407-7.120593v-8.362666h-49.682962v53.342814h-44.980149v-53.342814h-53.864296v53.342814h-42.363259V397.748148h33.820444l-15.521185-15.17037h55.267556l22.490074 15.17037h52.821333l23.883852-29.458963H1306.206815v-35.915852h234.30637v28.150519z m357.56563 197.44237h-202.752l-42.363259 55.959704h186.187851c4.181333 0 6.912-1.488593 8.192-4.456296 1.28-2.967704 1.915259-8.277333 1.91526-15.909926v-13.454223h48.810666v36.788149c-0.113778 22.897778-12.98963 34.341926-38.618074 34.341926H1589.665185v-31.032889l52.072296-62.236445h-53.295407v-37.309629h309.617778v37.309629z m0.692148-65.554963h-308.574815V455.111111h308.574815v37.300148z m357.916444 161.962667h-55.959703c-12.202667 0-20.660148-1.28-25.362963-3.84-4.702815-2.56-8.922074-5.755259-12.638815-9.585778l-59.97037-61.013333-52.821334 57.874963c-10.107259 11.036444-22.319407 16.564148-36.608 16.564148h-65.725629v-37.30963H1993.955556c9.528889 0 17.720889-3.77363 24.576-11.33037l60.491851-65.374815v-33.46963h48.810667v33.46963l62.132148 62.236445c4.446815 4.532148 8.106667 7.499852 10.970074 8.893629 2.863407 1.393778 7.632593 2.095407 14.307556 2.095408h41.424592v40.789333z",
          fill: "#393D49",
          ["p-id"]: "2457"
        }),
        c: common_vendor.p({
          d: "M1011.408593 387.290074v68.693333h34.341926v-73.054814h-34.341926zM1999.018667 401.758815h190.928592c4.295111 0 7.452444-0.379259 9.481482-1.156741s3.745185-2.171259 5.138963-4.190815c1.393778-2.019556 2.085926-5.470815 2.085926-10.344296V370.725926h-207.634963v31.032889zM1126.030222 613.015704c1.21363-2.010074 1.829926-4.209778 1.829926-6.618074v-14.610963H929.289481v24.234666h191.089778c2.550519 0 4.437333-1.005037 5.650963-3.005629zM929.289481 539.136h198.570667v22.319407H929.289481zM1447.414519 433.664h49.682962v19.702519h-49.682962zM101.300148 558.203259l-73.661629 127.61126-27.638519 47.834074 155.249778 25.827555 73.661629-127.611259z",
          fill: "#393D49",
          ["p-id"]: "2458"
        }),
        d: common_vendor.p({
          d: "M228.911407 631.864889l-73.661629 127.611259 100.001185 121.552593 27.600593-47.900445 73.690074-127.573333-127.630223-73.690074z m0 0",
          fill: "#2B333F",
          ["p-id"]: "2459"
        }),
        e: common_vendor.p({
          d: "M708.958815 685.814519L635.259259 558.203259l-127.611259 73.66163 73.690074 127.611259 155.211852-25.827555-27.591111-47.834074z m0 0",
          fill: "#282A30",
          ["p-id"]: "2460"
        }),
        f: common_vendor.p({
          d: "M507.648 631.864889L380.046222 705.564444 453.707852 833.137778l27.638518 47.900444 100.001186-121.552592-73.699556-127.620741z m0 0",
          fill: "#35363A",
          ["p-id"]: "2461"
        }),
        g: common_vendor.p({
          d: "M368.260741 763.041185c-89.02163 0.009481-172.999111-41.358222-227.252148-111.947852a285.874252 285.874252 0 0 1-60.103112-175.407407 287.337244 287.337244 0 0 1 84.15763-203.207111A287.374222 287.374222 0 0 1 368.260741 188.302222c1.232593 0 2.427259 0.227556 3.659852 0.227556 158.644148 1.005037 286.435556 130.436741 285.430518 289.080889-1.014519 158.644148-130.436741 286.435556-289.09037 285.430518m151.466666-582.096592A329.78963 329.78963 0 0 0 368.232296 144.118519c-183.115852 0-331.529481 148.451556-331.529481 331.567407 0 144.014222 91.941926 266.192593 220.169481 311.988148A331.602489 331.602489 0 0 0 368.260741 807.253333c183.10637-0.018963 331.529481-148.461037 331.529481-331.567407 0-124.245333-69.546667-238.032593-180.100741-294.731852",
          fill: "#647BA0",
          ["p-id"]: "2462"
        }),
        h: common_vendor.p({
          d: "M368.260741 696.727704c122.074074 0 221.041778-98.967704 221.041778-221.041778S490.344296 254.644148 368.260741 254.644148 147.218963 353.60237 147.218963 475.685926 246.186667 696.727704 368.260741 696.727704m1.298963 68.901926c-159.42163 0-288.654222-129.232593-288.654223-288.644741 0-159.42163 129.232593-288.654222 288.654223-288.654222 159.412148 0 288.644741 129.232593 288.64474 288.654222 0 159.412148-129.232593 288.644741-288.64474 288.644741",
          fill: "#7190A5",
          ["p-id"]: "2463"
        }),
        i: common_vendor.p({
          d: "M368.260741 652.515556c63.184593 0 121.562074-33.697185 153.15437-88.414815 31.592296-54.71763 31.592296-122.130963 0-176.839111-31.592296-54.71763-89.969778-88.414815-153.15437-88.414815-97.659259 0.009481-176.820148 79.17037-176.820148 176.829629S270.610963 652.515556 368.260741 652.515556m0 44.212148c-122.074074 0-221.041778-98.967704-221.041778-221.041778S246.186667 254.644148 368.260741 254.644148 589.312 353.60237 589.312 475.685926 490.344296 696.727704 368.260741 696.727704",
          fill: "#425F89",
          ["p-id"]: "2464"
        }),
        j: common_vendor.p({
          d: "M312.983704 512.512c33.317926 0.625778 64.369778-16.791704 81.199407-45.539556 16.839111-28.747852 16.839111-64.350815 0-93.108148-16.82963-28.73837-47.881481-46.155852-81.199407-45.530074-50.185481 0.938667-90.377481 41.898667-90.377482 92.09363s40.192 91.145481 90.377482 92.084148m55.277037 140.003556c-63.175111 0.009481-121.552593-33.687704-153.144889-88.395852-31.592296-54.708148-31.601778-122.121481-0.018963-176.839111 31.582815-54.71763 89.960296-88.424296 153.135407-88.433778 97.659259 0.009481 176.82963 79.17037 176.82963 176.829629s-79.17037 176.82963-176.82963 176.82963",
          fill: "#8DA5B2",
          ["p-id"]: "2465"
        }),
        k: common_vendor.p({
          d: "M220.880593 420.408889c0 50.868148 41.234963 92.103111 92.103111 92.103111s92.103111-41.234963 92.103111-92.103111-41.234963-92.103111-92.103111-92.103111c-50.868148-0.009481-92.103111 41.234963-92.103111 92.103111",
          fill: "#EAF3FF",
          ["p-id"]: "2466"
        }),
        l: common_vendor.p({
          t: "1698073471397",
          width: "2.5em",
          height: "1em",
          viewBox: "0 0 2583 1024",
          version: "1.1"
        }),
        m: common_vendor.s(__props.style)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-72bb64af"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/Common-component/UI/Member1.vue"]]);
wx.createComponent(Component);
