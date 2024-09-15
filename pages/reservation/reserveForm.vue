<template>
	<view style="padding: 10px;">
		<uni-forms :modelValue="formData">
			<uni-forms-item label="预约人" name="account">
				<uni-easyinput type="text" v-model="formData.reserveUserAccount" />
			</uni-forms-item>
			<uni-forms-item label="场地名称" name="name">
				<uni-easyinput type="text" disabled v-model="formData.siteName" />
			</uni-forms-item>
			<uni-forms-item label="场地地址" name="address">
				<uni-easyinput type="text" disabled v-model="formData.siteAddress" />
			</uni-forms-item>
			<view style="display: flex;font-size: 13px;align-items: center;">
				<view style="margin-right: 35rpx;">预约时间</view>
				<uni-data-select v-model="formData.startTime" :localdata="aviableStart" @change="handleStart"
					:clear="false" placeholder="开始时间"></uni-data-select>
				<span style="margin-left: 10rpx;margin-right: 10rpx;">-</span>
				<uni-data-select v-model="formData.endTime" :localdata="aviableEnd" :clear="false"
					placeholder="结束时间"></uni-data-select>
			</view>
			<view style="display: flex;font-size: 13px;align-items: center;margin-top: 10px;">
				<button @click="submit"
					style="background-color: #5cd375;color: white;width: 50vw;margin-top: 20rpx;">提交</button>
			</view>
		</uni-forms>
	</view>
</template>
<script setup>
	import {ref} from "vue";
	import request from "../../common/request";
	import {useUserStore} from "@/store/user.js"
	import {onReady,onLoad,onShow} from '@dcloudio/uni-app';
	const userStore = useUserStore()
	const { user } = userStore
	let time = ref('9:00')
	let formData = ref({
		endTime: "",
		ifReservation: '',
		ifUse: false,
		isReserve: '',
		reserveUserAccount: "",
		siteAddress: "",
		siteId: '',
		siteName: "",
		siteType: '',
		startTime: ""
	})
	//获取预约时间的参数
	let reserveParam=ref({siteType: '',siteId: ''})
	//所有可用时间
	let aviableTime = ref([])
	//可用开始时间
	let aviableStart = ref(new Set())
	//开始时间
	let startTime = ref(aviableStart.value[0])
	//可用结束时间
	let aviableEnd = ref([])
	onLoad((options) => {
		let dataString = decodeURIComponent(options.data);
		let reservationData = JSON.parse(dataString);
		formData.value = reservationData
		formData.value.id = ''
		formData.value.startTime = ''
		formData.value.endTime = ''
		formData.value.reserveUserAccount = user.account
		reserveParam.value.siteId=reservationData.siteId
		reserveParam.value.siteType =reservationData.siteType
		getReserTime()
	})
	const getReserTime = () => {
		request.get("/reservationSite/getReserTime",reserveParam.value).then(
			res => {
				aviableTime.value = res.data
				for (let i in aviableTime.value) {
					aviableStart.value.add(aviableTime.value[i].split('-')[0])
				}
				const aviableStartArray = Array.from(aviableStart.value); // 将 Set 转换为数组
				const objectArray = aviableStartArray.map(time => ({
					value: time,
					text: time
				}));
				aviableStart.value = objectArray
			}
		)
	}
	const handleStart = () => {
		let startTime = ref(formData.value.startTime)
		console.log(aviableTime.value);
		aviableEnd.value = []
		for (let i in aviableTime.value) {
			let item = aviableTime.value[i].split('-')[0]
			let endItem = aviableTime.value[i].split('-')[1]
			if (item === startTime.value) {
				aviableEnd.value.push({
					value: endItem,
					text: endItem
				})
			}
		}
	}
	const submit = () => {
		console.log(formData.value, 'fv');
		if (formData.value.reserveUserAccount === '') {
			uni.showToast({
				title:"请输入预约人",
				icon:'error'
			})
			return
		}
		if (formData.value.startTime === '') {
			uni.showToast({
				title:"请输入开始时间",
				icon:'error'
			})
			return
		}
		if (formData.value.endTime === '') {
			uni.showToast({
				title:"请输入结束时间",
				icon:'error'
			})
			return
		}
		request.post('/reservationSite/saveReservation',formData.value).then(
		res=>{
			if(res.data.code===1){
				uni.showToast({
					title:"预约成功"
				})
			setTimeout(function(){
			uni.navigateBack({
			delta: 1 
				});
			}, 2000);
			}
		}
		)
	}
</script>

<style>
</style>