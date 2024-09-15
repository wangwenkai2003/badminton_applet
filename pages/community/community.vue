<template>
		<view  style="display: flex;justify-content: space-around; ">
			<view class="nav-item" :class="{'active':acitiveIndex===0}" @click="followDynamics"> 关注动态</view>
			<view class="nav-item" :class="{'active':acitiveIndex===1}" @click="myDynamics">我的动态</view>
			<view class="nav-item" :class="{'active':acitiveIndex===2}" @click="equipmentMarket">装备市场</view>
		</view>
		<myDynamicsCard v-show="acitiveIndex===1"></myDynamicsCard>
		<followCard v-show="acitiveIndex===0"></followCard>
		<equipmentCard v-show="acitiveIndex===2"></equipmentCard>
</template>

<script setup>
import {useUserStore} from "@/store/user.js"
import { onBeforeMount, ref } from "vue";
import {onReady,onLoad,onShow} from '@dcloudio/uni-app'
import myDynamicsCard  from '@/commpoents/myDynamicsCard/myDynamicsCard.vue'
import followCard from '@/commpoents/followCard/followCard.vue'
import equipmentCard from '@/commpoents/equiptmentCard/equiptmentCard.vue'

let acitiveIndex = ref(1)
onShow(()=>
	{
		const userStore = useUserStore()
		const { token } = userStore
		if(token===''){
				console.log("未登录");
				uni.navigateTo({
				url:'/pages/my/my-login'
				})
			}
	}
)
const followDynamics = ()=>{
	acitiveIndex.value = 0
}
const myDynamics= ()=>{
	acitiveIndex.value = 1
}
const equipmentMarket= ()=>{
	acitiveIndex.value = 2
}
</script>

<style >
.active{
	border-bottom: 1px #5cd375 solid;
}
</style>
