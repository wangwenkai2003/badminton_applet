<template>
	<view>
		<view @click="gotoChat(item.account)" class="chat_item" v-for="(item) in messageList" >
				<img :src="item.avatar" style="width: 160rpx;height: 160rpx;" alt="">
				<view style="display: flex;flex-direction: column;margin-left: 20rpx;"><h2 style="font-size: 18px;">{{item.name}}</h2>
				<view v-if="item.ifImg ===0" style="font-size: 12px;color: #999999;margin-top: 10rpx;">{{item.content}}</view>
				<view v-if="item.ifImg ===1" style="font-size: 12px;color: #999999;margin-top: 10rpx;">[图片]</view>
				 </view>
		</view>
	</view>
</template>

<script setup>
import {onReady,onLoad,onShow} from '@dcloudio/uni-app'
import { onMounted, ref } from "vue";
import {useUserStore} from "@/store/user.js"
import request from "@/common/request.js"
const formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})
const userStore = useUserStore()
const { token } = userStore
const { user } = userStore
formModel.value = user
let messageList = ref([])
onShow(()=>{
	messageList.value=[]
	request.get('/chat/getChats?formUser='+user.account).then(
		res=>{
			
			for (var key in res.data.data) {
				let messageValue =  res.data.data[key]
				let notRead= messageValue.filter(item => item.ifReceive ===0)
				let lastMessage =  messageValue[messageValue.length-1]
				console.log(lastMessage);
				const newKey = key.split('-')
				let filterKey = newKey.filter(item => item !== user.account)
				request.get('/user/getUserByAccount?account='+filterKey).then(
				res=>{
					var mergedObject = { ...lastMessage, ...res.data.data };
					messageList.value.push(mergedObject)
				})
			}
			console.log(messageList.value,'mlt');
			
		}
	)

})
	//私信
	const gotoChat = (account)=>{
		uni.navigateTo({
			 url: '/subpkg/chat/chat?userAccount='+account
		});
	}

</script>

<style>
	.chat_item{
		height: 15vh;
		border-bottom:1px solid #f4f4f4 ;
		padding: 20rpx;
		display: flex;
		align-items: center;
		
	}
</style>
