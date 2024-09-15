<template>
	<view>
		<view v-for="(item,index) in Reservations" :key="index">
			<uni-card :title="item.siteName" :sub-title="subTitle" :extra="item.siteAddress" >
				<view style="display: flex;align-items: center;">
					<view style="margin-right: auto;font-size: 12px;"><span>状态:</span><span v-if="item.ifUse" style="color: #ff0000;">在用</span>
					<span v-if="item.status==='未使用'" style="color: #5cd375;">{{item.status}}</span>
					<span v-if="item.status==='使用中'" style="color: #E6A23C;">{{item.status}}</span>
					<span v-if="item.status==='已过期'" style="color: #909399;">{{item.status}}</span>
					<view >开始时间:{{item.startTime}}</view>
					<view >结束时间:{{item.endTime}}</view>
					</view>
				</view>
			</uni-card>
		</view>	 
	</view>
</template>

<script setup>
import {onReady,onLoad,onShow,onUnload} from '@dcloudio/uni-app'	
import { ref } from "vue";
import request from "@/common/request.js"
import {useUserStore} from "@/store/user.js"
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
	getbyAccount()
})

let Reservations =ref([])
//获取预约信息
const getbyAccount =()=>{
	request.get('/reservationSite/getByAccount?userAccount='+formModel.value.account).then(
	res =>{
		Reservations.value = res.data.data
	}
	)
}
</script>

<style>

</style>
