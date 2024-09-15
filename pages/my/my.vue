<template>
	<view class="" style="background-color: #f9f9f9;">
		<view class=""  style="display: flex;align-items: center;padding: 10rpx;">
			<img @click="previewImage" :src="formModel.avatar" style="width: 150rpx;height: 150rpx;border-radius: 50%;">
			<view style="margin-left: 10rpx;font-size: 18px;font-weight: 700;">{{formModel.name}}</view>
			<view v-if="formModel.sex==='0'" style="margin-left: auto;margin-right: 80rpx;"><img src="@/static/man.png" style="width: 70rpx;height: 70rpx;" alt=""></view>
			<view v-if="formModel.sex==='1'" style="margin-left: auto;margin-right: 80rpx;"><img src="@/static/woman.png" style="width: 70rpx;height: 70rpx;" alt=""></view>
		</view>

			<ul style="display: flex;justify-content: space-around;align-items: center;background-color: #fff;height: 100rpx;">
				<li @click="toFollow"><span style="color: #a7a7a7;">关注</span>: <span>{{followCount}}</span></li>
				<li @click="toBeFollow"><span style="color: #a7a7a7;">粉丝</span>: <span>{{beFollowCount}}</span></li>
				<li><span style="color: #a7a7a7;">动态</span>: <span>{{dynamicsCount}}</span></li>
			</ul>

		<view class="" style="margin-top: 5rpx;background-color: #fff;padding: 10rpx;">
			<ul>
				<li @click="updateUser" class="base-item" style="display: flex;"><img src="@/static/update.png" style="width: 50rpx;height: 50rpx"><span style="margin-left: 20rpx;">修改资料</span></li>
				<li @click="collect" class="base-item" style="display: flex;"><img src="@/static/collect.png" style="width: 50rpx;height: 50rpx"><span style="margin-left: 20rpx;">我的收藏</span></li>
				<li @click="toReserve" class="base-item" style="display: flex;"><img src="@/static/reserve.png" style="width: 50rpx;height: 50rpx"><span style="margin-left: 20rpx;">我的预约</span></li>
				<li @click="exit" class="base-item" style="display: flex;"><img src="@/static/layout.png" style="width: 50rpx;height: 50rpx"><span style="margin-left: 20rpx;">退出登录</span></li>
			</ul>
		</view>
	</view>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import request from "@/common/request.js"
import {useUserStore} from "@/store/user.js"
import {onReady,onLoad,onShow,onPullDownRefresh,onReachBottom} from '@dcloudio/uni-app'



const formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})
let account = ref('')
const userStore = useUserStore()
const { user } = userStore
formModel.value = user

account.value = formModel.value.account


onShow(()=>{
	getFollowAndFans(account.value)
	getDynamicsCount(account.value)
})

//关注列表
let followAndFansList = ref([])
let followCount = ref(0)
let beFollowCount = ref(0)
const getFollowAndFans=(account)=>{
	console.log(formModel.value,'fv');
	request.get('/follow/getFollowAndFans?userAccount='+account).then(
	result=>{
		if(result.data.code===1){
			followCount.value =result.data.data[0]
			beFollowCount.value =result.data.data[1]
		}
	}
)
}
//获取动态数量
let dynamicsCount = ref(0)
const getDynamicsCount=(account)=>{
	request.get('/dynamics/getDynamicsCount?userAccount='+account.value).then(
	result=>{
		if(result.data.code===1){
			dynamicsCount.value= result.data.data
		}
	})
}

let followData =ref({
	account:account.value,
	type:''
})
//跳转关注列表
const  toFollow =()=>{
	followData.value.type='follow'
	uni.navigateTo({
		url:'/pages/follow/UserFollow?data='+ JSON.stringify(followData.value)
	})
}
//跳转粉丝列表
const toBeFollow= ()=>{
	followData.value.type='beFollow'
	uni.navigateTo({
		url:'/pages/follow/UserFollow?data='+ JSON.stringify(followData.value)
	})
}
//修改个人资料
const updateUser=()=>{
	uni.navigateTo({
		url:'/pages/my/update-user'
	})
}
//退出登录
const exit =()=>{
	uni.showModal({
		title:'是否要退出登录O.o？',
		success: (res) => {
		    if (res.confirm) {
		      // 用户点击了确认按钮
				userStore.removeToken()
				userStore.setUser({})
				uni.navigateTo({
					url:'/pages/my/my-login'
				})
		    } else if (res.cancel) {
		      // 用户点击了取消按钮
		      // 可以添加取消操作的代码
		    }
		  }
	})
}
//预览图片
const previewImage = ()=> {
    uni.previewImage({
      urls: [formModel.value.avatar],
      current: formModel.value.avatar
    })
  }
  
// 跳转到消息页面
  const collect = ()=>{
	 uni.navigateTo({
	   url: '/subpkg/collect/collect'
	 })
  }
// 跳转到消息页面
  const toReserve = ()=>{
	 uni.navigateTo({
	   url: '/subpkg/myclloect/myclloect'
	 })
  }
</script>

<style scoped>
.base-item{
	display: flex;
	align-items: center;
	padding: 10rpx;
	height: 100rpx;
	border-bottom: 1rpx #f4f4f4 solid;
	line-height: 100rpx;
}
</style>
