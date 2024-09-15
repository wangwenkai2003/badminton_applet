<template>
	<view style="padding: 30rpx;">
		<view class="card_head" style="display: flex; align-items: center;">
		  <img  style="width: 100rpx;height: 100rpx; border-radius: 50%;" :src="equiptment.user.avatar" />
		  <view style="margin-left: 10rpx;display: flex;justify-content: space-between;">
			  <view>{{equiptment.user.name}}</view>
		  </view>
			<view style="margin-left: auto;">
				<button
								@click="saveFollow()"
						v-if="isFollow=== -1"
						size="mini"
						style="background-color: #00b8f6;color: #fff;"
						 >
						<span>关注</span>
						 </button>
						 <button
						   @click="cancelFollow()"
						   v-if="isFollow=== 1"
						size="mini"
						   style="
						     background-color: #7f7f7f;
						     color: #fff;
						   "
						 >
						   <span style="margin-left: 1rpx">已关注</span>
						 </button>
			</view>
		  </view>
		<view style="color: red;"><text style="font-size: 12px;">￥</text>{{equiptment.price}}</view>
		<view>{{equiptment.descContent}}</view>
		<view v-for="(item,index) in equiptment.imgs" :key="index" style="display: flex; flex-direction: column;align-items: center;">
			<image :src="item" mode="widthFix" style="width: 100%;"></image>
		</view>
		<view style="position: fixed;bottom: 0%;width: 100%;height: 100rpx;background-color: #fff;display: flex;align-items: center;">
			<view class="bottom-item" v-if="!isCollect" @click="toCollect"><uni-icons type="star" size="30"></uni-icons><view>收藏</view></view> 
			<view class="bottom-item" v-if="isCollect" @click="cancleCollct"><uni-icons type="star-filled" size="30"></uni-icons><view>收藏</view></view> 
			<view @click="gotoChat" class="bottom-item" style="margin-left: auto;margin-right: 50rpx;"><uni-icons type="chatbubble" size="30"></uni-icons><view>私聊</view></view> 
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref } from "vue";
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
const userStore = useUserStore()
const { user } = userStore
formModel.value = user

let isFollow = ref(-1)
let equiptment = ref({})
onLoad((option)=>{
	const item = JSON.parse(decodeURIComponent(option.equiptment));
	equiptment.value = item
	getMyFollow()
	checkCollect()  
})

//关注表单
const followForm = ref({
  befollowUserAccount: '',
  followUserAccount: ''
})
//保存关注
const saveFollow = () => {
  followForm.value.befollowUserAccount = equiptment.value.account
  followForm.value.followUserAccount = formModel.value.account
  request.post('/follow/saveFollow',followForm.value).then((res) => {
		isFollow.value = 1
  })
}
//关注列表
let followList = ref([])
//获取关注列表
const getMyFollow = () => {
	if(equiptment.value.user.account === formModel.value.account){
		isFollow.value=0
		return
	}
  request.get('/follow/getMyFollow?userAccount='+formModel.value.account).then((res) => {
    console.log(res, 'userfollow')
    if (
      res.data.data !== null &&
      res.data.data !== undefined &&
      res.data.data.length > 0
    ) {
      followList.value = res.data.data
		followList.value.forEach((follow) =>{
			if (equiptment.value.user.account === follow.account) {
			  isFollow.value = 1
			}
		})
    }
  })
}
// 取消关注
const cancelFollow = async () => {
	uni.showModal({
		title:'是否取消关注？',
		success: (res) => {
		    if (res.confirm) {
		      // 用户点击了确认按钮
		      followForm.value.befollowUserAccount = equiptment.value.user.account
		      followForm.value.followUserAccount = formModel.value.account
			  request.delete('/follow/deleteFollow',followForm.value).then((res) => {
			    if (res.data.code === 1) {
					isFollow.value= -1
			      }
				  })

		      // 执行下面的代码
		      // ...
		    } else if (res.cancel) {
		      // 用户点击了取消按钮
		      // 可以添加取消操作的代码
		    }
		  }
	})
}
//私信
const gotoChat = ()=>{
	uni.navigateTo({
		 url: '/subpkg/chat/chat?userAccount='+equiptment.value.user.account
	});
}

//收藏
let collectForm=ref({
	userAccount:'',
	equiptmentId:''
})
const toCollect=()=>{
	collectForm.value.userAccount = formModel.value.account
	collectForm.value.equiptmentId = equiptment.value.id
	request.post("/collect/save",collectForm.value).then(
		res =>{
			if(res.data.code === 1){
				isCollect.value = true
			}
		}
	)
}
let isCollect = ref(false)
//检查是否已经收藏
const checkCollect = ()=>{
	request.get("/collect/getByAccount?userAccount="+formModel.value.account).then(
		res =>{
			res.data.data.forEach((item)=>{
				if(item.equiptmentId === equiptment.value.id){
					isCollect.value = true
				}
			})
		}
	)
}
//取消收藏
let cancleCollct =()=>{
	collectForm.value.userAccount = formModel.value.account
	collectForm.value.equiptmentId = equiptment.value.id
	request.post("/collect/delete",collectForm.value).then(
		res =>{
			if(res.data.code ===1){
				isCollect.value = false
			}
		}
	)
}
</script>

<style scoped>
.bottom-item{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 12px;
}	
</style>