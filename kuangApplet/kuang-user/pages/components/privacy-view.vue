<template>
	<!-- 用户隐私保护弹窗 -->
	<view class="privacy-view" v-if="showPrivacy">
	  <view class="privacy-mask"  />
	  <view class="privacy-dialog-wrap">
		<view class="privacy-dialog">
		  <view class="privacy-dialog-header">用户隐私保护提示</view>
		  <view class="privacy-dialog-content">感谢您使用本小程序，在使用前您应当阅读井同意<text class="privacy-link" @click="openPrivacyContract">《用户隐私保护指引》</text>，当点击同意并继续时，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力；如您不同意，将无法继续使用小程序相关功能。</view>
		  <view class="privacy-dialog-footer">
			<!-- <button
			  id="btn-disagree"
			  type="default"
			  class="btn btn-disagree"
			  @click="handleDisagree"
			>不同意</button> -->
			<navigator id="btn-disagree" open-type="exit" class="btn btn-disagree" target="miniProgram" @click="handleDisagree">不同意</navigator>
			<button
			  id="agree-btn"
			  type="default"
			  open-type="agreePrivacyAuthorization"
			  @agreeprivacyauthorization.stop="handleAgree"
			  class="btn btn-agree"
			>同意并继续</button>
		  </view>
		</view>
	  </view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import {reactive} from 'vue'
	import {onLoad,onReachBottom} from '@dcloudio/uni-app'
	
	const showPrivacy = ref(false)
	const resolvePrivacyAuthorization = ref()
	let privacyHandler
	let privacyResolves = new Set()
	let closeOtherPagePopUpHooks = new Set()
	if (wx.onNeedPrivacyAuthorization) {
	  wx.onNeedPrivacyAuthorization(resolve => {
		  console.log('resolve', resolve)
	    if (typeof privacyHandler === 'function') {
	      privacyHandler(resolve)
	    }
	  })
	}
	
	const closeOtherPagePopUp = (closePopUp) => {
	  closeOtherPagePopUpHooks.forEach(hook => {
	    if (closePopUp !== hook) {
	      hook()
	    }
	  })
	}
	
	onLoad((event)=>{
		wx.getPrivacySetting({
		  success: res => {
			console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
			if (res.needAuthorization) {
			  // 需要弹出隐私协议
			  showPrivacy.value = true
			  uni.hideTabBar()
			} else {
			  // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
			  // wx.getUserProfile()
			  // wx.chooseMedia()
			  // wx.getClipboardData()
			  // wx.startRecord()
			}
		  },
		  fail: () => {},
		  complete: () => {}
		})
	// 	wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
	// 	  console.log('触发本次事件的接口是：' + eventInfo.referrer)
	// 	  // 需要用户同意隐私授权时
	// 	  // 弹出开发者自定义的隐私授权弹窗
	// 	  showPrivacy.value = true
	// 	  resolvePrivacyAuthorization.value = resolve
	// 	})
	
	// 	wx.getUserProfile({
	// 	  success: console.log,
	// 	  fail: console.error
	// 	})
	})
	
	function handleAgree(e) {
	  disPopUp()
	   .forEach(resolve => {
		resolve({
		  event: 'agree',
		  buttonId: 'agree-btn'
		})
	  })
	  privacyResolves.clear()
	} 
	
	function handleDisagree(e) {
	  disPopUp()
	  privacyResolves.forEach(resolve => {
		resolve({
		  event: 'disagree',
		})
	  })
	  privacyResolves.clear()
	  if(window){
		  window.close()
	  }else{
		uni.navigateBackMiniProgram()	  
	  }
	}
	
	function popUp() {
	  showPrivacy.value=true
	}
	
	function disPopUp() {
	  showPrivacy.value=false
	  uni.showTabBar()
	}
	
	function openPrivacyContract() {
	  wx.openPrivacyContract({
		success: res => {
		  console.log('openPrivacyContract success')
		},
		fail: res => {
		  console.error('openPrivacyContract fail', res)
		}
	  })
	}
	
	// function curPageShow() {
	//   if (closePopUp) {
	// 	privacyHandler = resolve => {
	// 	  privacyResolves.add(resolve)
	// 	  popUp()
	// 	  // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
	// 	  closeOtherPagePopUp(closePopUp)
	// 	}
	//   }
	// }
</script>

<style scoped>
.privacy-view{
	position: fixed;
	top:0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: #FFFFFF;
	z-index: 998;
	background-color: transparent;
	animation: post-list-row .3s;
}

.privacy-mask {
  position: fixed;
  z-index: 5000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
}

.privacy-dialog-wrap {
  position: fixed;
  z-index: 5000;
  top: 16px;
  bottom: 16px;
  left: 80rpx;
  right: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.privacy-dialog {
  background-color: #fff;
  border-radius: 32rpx;
}

.privacy-dialog-header {
  padding: 60rpx 40rpx 30rpx;
  font-weight: 700;
  font-size: 36rpx;
  text-align: center;
}

.privacy-dialog-content {
  font-size: 30rpx;
  color: #555;
  line-height: 2;
  text-align: left;
  padding: 0 40rpx;
}

.privacy-dialog-content .privacy-link {
  color: #2f80ed;
}

.privacy-dialog-footer {
  display: flex;
  padding: 20rpx 40rpx 60rpx;
}

.privacy-dialog-footer .btn {
  color: #FFF;
  font-size: 30rpx;
  font-weight: 500;
  line-height: 100rpx;
  text-align: center;
  height: 100rpx;
  border-radius: 20rpx;
  border: none;
  background: #07c160;
  flex: 1;
  margin-left: 30rpx;
  justify-content: center;
}

.privacy-dialog-footer .btn::after {
  border: none;
}

.privacy-dialog-footer .btn-disagree {
  color: #07c160;
  background: #f2f2f2;
  margin-left: 0;
}
</style>