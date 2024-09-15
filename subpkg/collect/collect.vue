<template>
	<view style="padding: 20rpx;">
		<view class="collect-item" v-for="(item,index) in collectList" @click="toEuiqptmentDetail(item.equiptmentDto)">
			<image style="width: 30%;height: 100%;" :src="item.equiptmentDto.imgs[0]"></image>
				<view style="display: flex; flex-direction: column;padding: 5rpx;margin: 0 5rpx;">
					<h3>{{item.equiptmentDto.title}}</h3>
					<text style="color: red;">￥{{item.equiptmentDto.price}}</text>
					<view  style="margin-top: auto; display: flex; align-items: center;"><image style="width: 100%;height: 100%;;border-radius: 50%;" :src="item.equiptmentDto.user.avatar"></image> 
					<span style="color: #a8abb4;margin-left: 5rpx;">{{item.equiptmentDto.user.name}}</span>
					</view>
				</view>
				<button size="mini" style="height: 35%;margin-top: auto;margin-left: auto;margin-right: 10rpx;" @click="toChat(item.equiptmentDto.user.account)">私聊</button>
		</view>
	</view>
</template>

<script setup>
import {onReady,onLoad,onShow,onUnload} from '@dcloudio/uni-app'	
import { ref } from "vue";
import {useUserStore} from "@/store/user.js"
import request from "@/common/request.js"

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

onShow(()=>{
	getAll()
})

let collectList = ref([])
//获取所有
const getAll =()=>{
	request.get('/collect/getAllByAccount?userAccount='+formModel.value.account).then(
		res =>{
			console.log(res,'res');
			collectList.value = res.data.data
		}
	)
}
//装备详情
const toEuiqptmentDetail =(item)=>{
	uni.navigateTo({
		url:"/pages/community/equiptmentDetail?equiptment="+ encodeURIComponent(JSON.stringify(item))
	})
}
//私聊
const toChat=(item)=>{
	uni.navigateTo({
		 url: '/subpkg/chat/chat?userAccount='+item
	});
}
</script>

<style>
	.collect-item{
		height: 15vh;
		padding: 5rpx;
		display: flex;
		border: 1px solid #f4f4f4;
	}
</style>
