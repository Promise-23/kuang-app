<template>
	<view class="my-page">
		<view class="user-info" v-if="exist">
			<view class="info">
				<image :src="user_infor.avatarUrl" mode="aspectFit"></image>
				<view class="text-info">
					<text class="nickname">{{user_infor.nickName}}</text>
					<view class="phone" >
						<text >{{mockPhone}}</text>
						<text class="copy-code" @click="copyCode">复制邀请码</text>
					</view>
					<!-- <view class="">
						<svg t="1698073471397" class="icon" viewBox="0 0 2583 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2455" width="200" height="200"><path d="M1348.570074 433.664h53.864296v19.702519h-53.864296zM1348.570074 489.28237h53.864296v19.000889h-53.864296zM1447.414519 489.28237h49.682962v19.000889h-49.682962z" fill="#393D49" p-id="2456"></path><path d="M2281.851259 190.369185H487.68c100.437333 51.2 163.726222 154.358519 163.858963 267.093334-0.028444 79.758222-31.829333 156.22637-88.348444 212.498962a302.096119 302.096119 0 0 1-213.248 88.026075c-34.531556-0.075852-68.788148-6.07763-101.300149-17.739852a301.230459 301.230459 0 0 0 168.324741 51.133629h1864.884148c166.570667 0 301.596444-134.542222 301.596445-300.534518s-135.025778-300.47763-301.596445-300.47763z m-331.65274 143.056593h305.265777v63.383703c0 6.817185-1.052444 13.198222-3.147852 19.143112-2.095407 5.944889-5.650963 11.282963-10.666666 16.023703-5.015704 4.731259-15.559111 7.10163-31.649185 7.10163h-259.802074V333.425778z m0 122.377481h305.265777v126.046815h-48.810666v-88.737185h-207.634963v88.737185h-48.810667V455.803259z m-360.002371-61.714963h29.11763c7.670519 0 12.724148-1.109333 15.17037-3.328 2.436741-2.218667 4.589037-5.025185 6.447408-8.410074l27.373037-51.361185h156.378074l24.576 46.373926c3.365926 6.580148 6.504296 10.789926 9.415111 12.61037 2.901333 1.820444 8.485926 2.730667 16.734815 2.730667h22.66074v37.30963h-41.140148c-11.273481 0-19.465481-1.194667-24.585481-3.574519-5.12-2.379852-9.765926-7.120593-13.94726-14.212741l-26.149925-43.927703h-87.343408l-27.894518 45.330963c-4.41837 7.092148-9.528889 11.823407-15.341037 14.21274-5.812148 2.379852-13.596444 3.574519-23.362371 3.574519h-48.118518v-37.328593zM1236.992 330.808889h51.427556v53.522963h-51.427556V330.808889z m-64.151704 284.340148c0 8.599704-2.721185 16.877037-8.163555 24.841482-5.44237 7.964444-16.791704 11.946667-34.048 11.946666H884.318815V503.220148h288.521481v111.928889z m12.724148-232.220444H1088.113778v73.045333H1185.564444v35.915852H871.414519v-35.915852h99.195259v-73.045333h-93.269334V347.022222h29.458963v-17.256296h39.746371l17.607111 17.256296h128.663704l21.968592-19.181037h41.841778V347.022222h28.937481v35.906371z m-5.224296 8.372148l-19.873185 32.777481c-4.532148 7.319704-9.14963 12.174222-13.861926 14.554074-4.702815 2.379852-11.245037 3.574519-19.617185 3.574519h-23.182222v-33.991111h8.893629c3.13837 0 6.039704-0.654222 8.713482-1.972148 2.673778-1.308444 7.319704-6.295704 13.947259-14.942815h44.980148z m-294.286222 0h45.150815c3.489185 5.575111 7.205926 10.107259 11.159703 13.596444 3.953778 3.489185 10.287407 4.939852 19.000889 4.361482v32.948148h-19.873185c-14.061037 0-23.333926-1.592889-27.809185-4.79763-4.475259-3.195259-8.106667-7.642074-10.894222-13.340444l-16.734815-32.768z m653.586963 260.456296H1319.803259c-11.159704 0-18.944-1.877333-23.36237-5.632l-15.17037-11.083852c-3.024593 3.991704-6.599111 7.888593-10.723556 11.700148-4.124444 3.811556-11.017481 5.717333-20.660148 5.717334h-21.266963v-37.30963h8.372148c2.673778 0 4.532148-0.758519 5.575111-2.266074 1.042963-1.517037 1.564444-6.637037 1.564445-15.378963V442.036148H1229.842963v-44.278518h59.278222V576.474074c0 5.461333 0.720593 10.68563 2.180741 15.68237 1.450667 4.996741 4.446815 10.078815 8.978963 15.246223 4.532148 5.167407 13.653333 7.74637 27.373037 7.74637h211.986963v36.608z m0.872296-291.233185l-31.55437 37.233778h30.511407v149.010963c0 10.81837-1.024 19.105185-3.062518 24.860444s-5.584593 11.510519-10.638223 17.275259c-5.044148 5.755259-12.619852 8.63763-22.717629 8.63763h-39.424v-35.915852h23.36237c3.602963 0 6.191407-0.654222 7.755852-1.953185s2.351407-3.678815 2.351407-7.120593v-8.362666h-49.682962v53.342814h-44.980149v-53.342814h-53.864296v53.342814h-42.363259V397.748148h33.820444l-15.521185-15.17037h55.267556l22.490074 15.17037h52.821333l23.883852-29.458963H1306.206815v-35.915852h234.30637v28.150519z m357.56563 197.44237h-202.752l-42.363259 55.959704h186.187851c4.181333 0 6.912-1.488593 8.192-4.456296 1.28-2.967704 1.915259-8.277333 1.91526-15.909926v-13.454223h48.810666v36.788149c-0.113778 22.897778-12.98963 34.341926-38.618074 34.341926H1589.665185v-31.032889l52.072296-62.236445h-53.295407v-37.309629h309.617778v37.309629z m0.692148-65.554963h-308.574815V455.111111h308.574815v37.300148z m357.916444 161.962667h-55.959703c-12.202667 0-20.660148-1.28-25.362963-3.84-4.702815-2.56-8.922074-5.755259-12.638815-9.585778l-59.97037-61.013333-52.821334 57.874963c-10.107259 11.036444-22.319407 16.564148-36.608 16.564148h-65.725629v-37.30963H1993.955556c9.528889 0 17.720889-3.77363 24.576-11.33037l60.491851-65.374815v-33.46963h48.810667v33.46963l62.132148 62.236445c4.446815 4.532148 8.106667 7.499852 10.970074 8.893629 2.863407 1.393778 7.632593 2.095407 14.307556 2.095408h41.424592v40.789333z" fill="#393D49" p-id="2457"></path><path d="M1011.408593 387.290074v68.693333h34.341926v-73.054814h-34.341926zM1999.018667 401.758815h190.928592c4.295111 0 7.452444-0.379259 9.481482-1.156741s3.745185-2.171259 5.138963-4.190815c1.393778-2.019556 2.085926-5.470815 2.085926-10.344296V370.725926h-207.634963v31.032889zM1126.030222 613.015704c1.21363-2.010074 1.829926-4.209778 1.829926-6.618074v-14.610963H929.289481v24.234666h191.089778c2.550519 0 4.437333-1.005037 5.650963-3.005629zM929.289481 539.136h198.570667v22.319407H929.289481zM1447.414519 433.664h49.682962v19.702519h-49.682962zM101.300148 558.203259l-73.661629 127.61126-27.638519 47.834074 155.249778 25.827555 73.661629-127.611259z" fill="#393D49" p-id="2458"></path><path d="M228.911407 631.864889l-73.661629 127.611259 100.001185 121.552593 27.600593-47.900445 73.690074-127.573333-127.630223-73.690074z m0 0" fill="#2B333F" p-id="2459"></path><path d="M708.958815 685.814519L635.259259 558.203259l-127.611259 73.66163 73.690074 127.611259 155.211852-25.827555-27.591111-47.834074z m0 0" fill="#282A30" p-id="2460"></path><path d="M507.648 631.864889L380.046222 705.564444 453.707852 833.137778l27.638518 47.900444 100.001186-121.552592-73.699556-127.620741z m0 0" fill="#35363A" p-id="2461"></path><path d="M368.260741 763.041185c-89.02163 0.009481-172.999111-41.358222-227.252148-111.947852a285.874252 285.874252 0 0 1-60.103112-175.407407 287.337244 287.337244 0 0 1 84.15763-203.207111A287.374222 287.374222 0 0 1 368.260741 188.302222c1.232593 0 2.427259 0.227556 3.659852 0.227556 158.644148 1.005037 286.435556 130.436741 285.430518 289.080889-1.014519 158.644148-130.436741 286.435556-289.09037 285.430518m151.466666-582.096592A329.78963 329.78963 0 0 0 368.232296 144.118519c-183.115852 0-331.529481 148.451556-331.529481 331.567407 0 144.014222 91.941926 266.192593 220.169481 311.988148A331.602489 331.602489 0 0 0 368.260741 807.253333c183.10637-0.018963 331.529481-148.461037 331.529481-331.567407 0-124.245333-69.546667-238.032593-180.100741-294.731852" fill="#647BA0" p-id="2462"></path><path d="M368.260741 696.727704c122.074074 0 221.041778-98.967704 221.041778-221.041778S490.344296 254.644148 368.260741 254.644148 147.218963 353.60237 147.218963 475.685926 246.186667 696.727704 368.260741 696.727704m1.298963 68.901926c-159.42163 0-288.654222-129.232593-288.654223-288.644741 0-159.42163 129.232593-288.654222 288.654223-288.654222 159.412148 0 288.644741 129.232593 288.64474 288.654222 0 159.412148-129.232593 288.644741-288.64474 288.644741" fill="#7190A5" p-id="2463"></path><path d="M368.260741 652.515556c63.184593 0 121.562074-33.697185 153.15437-88.414815 31.592296-54.71763 31.592296-122.130963 0-176.839111-31.592296-54.71763-89.969778-88.414815-153.15437-88.414815-97.659259 0.009481-176.820148 79.17037-176.820148 176.829629S270.610963 652.515556 368.260741 652.515556m0 44.212148c-122.074074 0-221.041778-98.967704-221.041778-221.041778S246.186667 254.644148 368.260741 254.644148 589.312 353.60237 589.312 475.685926 490.344296 696.727704 368.260741 696.727704" fill="#425F89" p-id="2464"></path><path d="M312.983704 512.512c33.317926 0.625778 64.369778-16.791704 81.199407-45.539556 16.839111-28.747852 16.839111-64.350815 0-93.108148-16.82963-28.73837-47.881481-46.155852-81.199407-45.530074-50.185481 0.938667-90.377481 41.898667-90.377482 92.09363s40.192 91.145481 90.377482 92.084148m55.277037 140.003556c-63.175111 0.009481-121.552593-33.687704-153.144889-88.395852-31.592296-54.708148-31.601778-122.121481-0.018963-176.839111 31.582815-54.71763 89.960296-88.424296 153.135407-88.433778 97.659259 0.009481 176.82963 79.17037 176.82963 176.829629s-79.17037 176.82963-176.82963 176.82963" fill="#8DA5B2" p-id="2465"></path><path d="M220.880593 420.408889c0 50.868148 41.234963 92.103111 92.103111 92.103111s92.103111-41.234963 92.103111-92.103111-41.234963-92.103111-92.103111-92.103111c-50.868148-0.009481-92.103111 41.234963-92.103111 92.103111" fill="#EAF3FF" p-id="2466"></path></svg>
					</view> -->
				</view>
				
			</view>
			<view class="logout" @click="goLogout">
				<image src="../../static/img/logout.png" />
			</view>
		</view>
		<view class="user-info" v-else="!exist" @click="goLogin">
			<view class="info">
				<image src="/static/detail/weidenglu.svg" mode="aspectFit"></image>
				<text class="text-info">点击登录</text>
			</view>
		</view>
		<view class="propertys" v-if="exist">
			<view class="box integral" @click="goDetail('integral')">
				<image src="/static/img/integral.png" mode="aspectFit"></image>
				<text class="num">{{ myIntegral.count || 0}}</text>
				<text>积分</text>
			</view>
			<view class="box" @click="goDetail('coupon')">
				<image src="/static/img/coupon.png" mode="aspectFit"></image>
				<view>
					 <text class="num">{{ myCoupons.data.length }}</text>
					 <text class="desc"> 张可用</text>
				</view>
				<text>优惠券</text>
			</view>
			<!-- <view class="box" @click="goDetail('kcoin')">
				<image src="/static/img/k_coin.png" mode="aspectFit"></image>
				<text class="num">{{ user_infor.kcoin || 0}}</text>
				<text>K币</text>
			</view> -->
		</view>
		<!-- <image class="shuibo-img" src="https://qita-1252107261.cos.ap-chengdu.myqcloud.com/boliang" mode="scaleToFill"></image> -->
	</view>
	<view class="my-order">
		<view class="my-order-title more">
			<view>我的订单</view>
			<view class="more" v-for="(item,index) in list_data.whole" :key="index" @click="viewOrder(item.index,item.query)">
				<text>{{item.name}}</text>
				<image :src="item.icon" mode="aspectFit"></image>
			</view>
		</view>
		<view class="order-state">
			<view v-for="(item,index) in list_data.list" :key="index" @click="viewOrder(item.index,item.query)">
				<image :src="item.icon" mode="aspectFit"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
	<!--  -->
	<view class="my-other">
		<view @click="myCollect">
			<image src="/static/detail/wodeshoucang.svg" mode="aspectFit"></image>
			<text>我的收藏</text>
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit" class="my-other-deta"></image>
		</view>
		<view @click="getInfo">
			<image src="/static/detail/shouhuodizhi.svg" mode="aspectFit" ></image>
			<text>收货地址</text>
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit" class="my-other-deta"></image>
		</view>
		<view @click="goWelfare">
			<image src="/static/detail/fulizhongxin.svg" mode="aspectFit" ></image>
			<text>领券中心</text>
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit" class="my-other-deta"></image>
		</view>
<!-- 		<view>
			<image src="/static/detail/yijianfankui.svg" mode="aspectFit"></image>
			<text>意见反馈(开发中)</text>
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit" class="my-other-deta"></image>
		</view> -->
	</view>
	<!-- 登陆弹窗 -->
	<Login />
</template>

<script setup>
	import {computed, reactive,toRefs,watch, ref} from 'vue'
	import {onShow} from '@dcloudio/uni-app'
	import Login from '../components/login-view.vue'
	import { currentTime, transferTime } from '../../Acc-config/public.js'
	import { myCoupons, myIntegral } from '../../Acc-config/answer.js'
	
	const list_data = reactive({
		whole:[
			{
				index:0,
				name:'查看全部订单',
				icon:'/static/detail/xiangyou-jiantou.svg',
				query:{}
			}
		],
		list:[
			{
				index:1,
				name:'待付款',
				icon:'/static/detail/daifukuan.svg',
				query:{pay_success:'not_pay'}
			},
			{
				index:2,
				name:'待发货',
				icon:'/static/detail/daifahuo.svg',
				query:{pay_success:'success',deliver:'stay'}
			},
			{
				index:3,
				name:'待收货',
				icon:'/static/detail/daishouhuo.svg',
				query:{pay_success:'success',deliver:'already'}
			},
			{
				index:4,
				name:'待评价',
				icon:'/static/detail/daipingjia.svg',
				query:{pay_success:'success',deliver:'rece_goods',evaluate:false}
			}
		]
	})
	
	// 查询是否登陆
	onShow(()=>{
		staTus()
	})
	const user = reactive({user_infor:{},exist:false})
	const {user_infor,exist} = toRefs(user)
	const mockPhone = computed(() => {
		const tel = user_infor.value?.phone ?? ''
		return tel.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
	})
	function staTus(){
		const user_data = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(user_data){
			user.exist = true
			queryUserInfo()
			getCoupons()
			getIntegral()
		}else{
			user.exist = false
		}
	}
	import {login_user} from '@/Acc-config/answer.js'
	// 调用登陆弹窗
	function goLogin(){
		console.log('gologin')
		login_user.show = true
	}
	
	// 退出登陆
	function goLogout(){
		// 询问用户是否退出登录
		uni.showModal({
		  title: '提示',
		  content: '确认退出登录吗？',
		  success: function (res) {
			  if (res.confirm) {
				  uni.removeStorageSync('user_infor');
				  uni.switchTab({
					  //跳转到主页
					url: '/pages/index/index',
					success: () => {
						  //跳转成功后提示退出成功
						wx.showToast({
						  title: '退出成功'
						})
					},
				  })
			  } else if (res.cancel) {
				  console.log('用户点击取消');
			  }
		  }
		})	
	}
	
	// 监听登陆是否成功，成功则重新取收藏和购物车的数据
	watch(()=>login_user.response,(newVal,oldVal)=>{
		staTus()
	})
	
	// 查看订单
	function viewOrder(index,query){
		if(user.exist){
			let obj = JSON.stringify({index,query})
			wx.navigateTo({
				url:`/pages/All-orders/order?obj=${obj}`
			})
		}else{
			login_user.show = true
		}
	}
	
	// 查看收货地址
	function getInfo(){
		if(user.exist){
			wx.navigateTo({
				url:'/pages/Re-address/address'
			})
		}else{
			login_user.show = true
		}
	}
	
	// 我的收藏
	function myCollect(){
		if(user.exist){
			wx.navigateTo({
				url:'/pages/My-collection/collection'
			})
		}else{
			login_user.show = true
		}
	}
	const db = wx.cloud.database()
	// 查询用户信息
	async function queryUserInfo(){
		// 存储数据库查询数据库是否存在用户信息，不存在则提交
		const query_openid = await db.collection('user_infor').get()
		console.log('queryUserInfo', query_openid)
		if(query_openid.data.length > 0){
			const info = query_openid.data[0]
			user.user_infor = info
			wx.setStorageSync('user_infor', info)
		}
	}
	
	// 跳转资产详情
	function goDetail(type){
		const url = `/pages/property/${type}`
		console.log('goDetail', url)
		wx.navigateTo({
			url: url
		})
	}
	
	// 领券中心
	function goWelfare(){
		if(user.exist){
			wx.navigateTo({
				url:'/pages/welfare/center'
			})
		}else{
			login_user.show = true
		}
	}
	
	// 获取当前可用优惠券
	async function getCoupons(coupon){
		const res = await db.collection('coupon_detail').where({used: false}).get()
		console.log('getCoupons', res?.data)
		const rightTimeList = res?.data?.filter((item) => (transferTime(item.time[0]) <= currentTime()) && (transferTime(item.time[1]) >= currentTime()))
		console.log('rightTimeList', rightTimeList)
		myCoupons.data = rightTimeList
	}
	
	// 查询当前积分
	async function getIntegral(){
		const res = await db.collection('integral_detail').get()
		console.log('integralDetail', res.data)
		myIntegral.data = res.data
		myIntegral.count = res.data.reduce(function (prev, cur) {
			console.log('reduce', prev, cur)
			return prev + (cur.type == 'add' ? cur.num : (-1 * cur.num));
		},0);
	}
	
	// 复制邀请码
	function copyCode(){
		if(user.exist){
			uni.setClipboardData({
				data:user?.user_infor?._id,//要被复制的内容
				success:()=>{//复制成功的回调函数
				  uni.showToast({//提示
					title:'复制成功'
				  })
				},
				fail() {
					uni.showToast({//提示
						title:'复制失败'
					})
				}
			});
		}else{
			login_user.show = true
		}
		
	}
	
</script>

<style scoped>
.my-page{
	height:350rpx;
	width: calc(100% - 80rpx);
	padding: 20rpx;
	margin: 0 auto;
	background-image: linear-gradient(to bottom right, #000 0%, #575757 90%, #575757 100%);
	/* background-image: linear-gradient(to bottom right, #EEDABC 0%, #987952 100%, #022F2C 100%); */
	position: relative;
	border-radius: 16rpx;
	box-shadow: 6px 6px 5px rgba(0,0,0,0.2);;
}
.user-info {
	display: flex;
	justify-content: space-between;
}
.user-info image{
	display: block;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-bottom: 10rpx;
}
.user-info .info{
	color: #FFFFFF;
	display: flex;
	align-items: center;
	/* justify-content: center; */
	margin-left: 50rpx;
	margin-top: 50rpx;
	font-size: 33rpx;
	z-index: 9;
	background: linear-gradient(to bottom right, #EEDABC 0%, #987952 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;  
}

.user-info .logout image{
	width: 40rpx;
	height: 40rpx;
}

.propertys{
	margin-top: 40rpx;
	display: flex;
	align-items: flex-end;
	justify-content: space-around;
}

.propertys .box{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 14px;
	background: linear-gradient(to bottom right, #EEDABC 0%, #987952 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;  
}


.propertys .box image{
	height: 50rpx;
	width: 50rpx;
}
.propertys .integral image{
	height: 40rpx;
	width: 40rpx;
}
.propertys .box .num{
	font-size: 18px;
	font-weight: 600;
	margin-top: 6rpx;
}
.propertys .box .desc{
	font-size: 12px;
}

.text-info{
	display: flex;
	flex-direction: column;
	margin-left: 20rpx;
}

.text-info .nickname{
	font-size: 14px;
}

.text-info .phone{
	display: flex;
    align-items: center;
	font-size: 12px;
	margin-top: 3px;
}

.text-info .copy-code{
	font-size: 10px;
	margin-left: 10rpx;
	border: 1px solid #575757;
	height: 15px;
	line-height: 15px;
	padding: 0 20rpx;
	border-radius: 20rpx;
}

.text-info .grade{
	font-size: 12px;
}

.shuibo-img{
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 170rpx;
	/* z-index: 99; */
	mix-blend-mode: screen;
}
/* 我的订单 */
.my-order{
	margin-top: 20rpx;
	padding: 0 40rpx;
}
.my-order-title image{
	width: 30rpx;
	height: 30rpx;
	display: block;
	margin-left: 10rpx;
}
.my-order-title{
	display: flex;
	justify-content: space-between;
}
.my-order-title view:nth-child(1){
	font-weight: bold;
}
.my-order-title view:nth-child(2){
	font-size: 25rpx;
	color: #cfcfcf;
}
.more{
	display: flex;
	align-items: center;
}
.order-state image{
	display: block;
	width: 50rpx;
	height: 50rpx;
	margin-bottom: 10rpx;
}
.order-state{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 30rpx;
}
.order-state view{
	display: flex;
	align-items: center;
	flex-direction: column;
	color: #4f4f4f;
}
/* 其他功能 */
.my-other{
	background-color: #FFFFFF;
	margin: 50rpx 20rpx 20rpx 20rpx;
	box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	border-radius: 6rpx;
	color: #828282;
}
.my-other image{
	display: block;
	width: 35rpx;
	height: 35rpx;
	margin-right: 20rpx;
}
.my-other view{
	display: flex;
	align-items: center;
	padding: 30rpx;
}
.my-other view:nth-child(2){
	border-bottom: 1rpx solid #e0e0e0;
	border-top: 1rpx solid #e0e0e0;
}
.my-other text{
	flex: 1;
}
.my-other-deta{
	width: 30rpx !important;
	height: 30rpx !important;
	margin: 0 !important;
}
</style>