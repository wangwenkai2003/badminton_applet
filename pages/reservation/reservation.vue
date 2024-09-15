<template>
	<view>
		 <uni-data-select
		        v-model="currentSite"
		        :localdata="campus"
		        @change="changeSiteType"
				:clear="false"
				placeholder="选择校区"
		      ></uni-data-select>
		<view v-for="(item,index) in ReservationS" :key="index">
			<uni-card :title="item.siteName" :sub-title="subTitle" :extra="item.siteAddress"  >
				<view style="display: flex;align-items: center;">
					<view style="margin-right: auto;font-size: 12px;"><span>状态:</span><span v-if="item.ifUse" style="color: #ff0000;">在用</span>
					<span v-if="!item.ifUse" style="color: #5cd375;">空闲</span>
					<view v-if="item.ifUse">结束时间:{{item.endTime}}</view>
					</view>
					<view><button size="mini" style="color:#7f7f7f;" @click="gotoReserve(item)">去预约</button></view>
				</view>
			</uni-card>
		</view>	  
		

	</view>
</template>

<script setup>
import { ref } from "vue";
import request from "../../common/request";
import {onReady,onLoad,onShow} from '@dcloudio/uni-app'
const campus =ref([{ value: 0, text: "东校区" },
          { value: 1, text: "西校区" },
          { value: 2, text: "武汉校区" }] )

let currentSite = ref(0)

let subTitle = ref("东校区")		  

onShow(()=>{
	getBySiteType(currentSite.value)
})
let ReservationS =ref([])
const getBySiteType =(siteType)=>{
	request.get("/site/getSiteAppoint?siteType="+siteType).then(
		res =>{
			console.log(res.data.data,'ress');
			ReservationS.value = res.data.data
		}
	)
}
//切换校区
const changeSiteType = ()=>{
	getBySiteType(currentSite.value)
	let item = campus.value.find(item => item.value === currentSite.value)
	console.log(item.text);
	subTitle.value= item.text
}

//跳转到预约界面
const gotoReserve =(item)=>{
	let queryString = encodeURIComponent(JSON.stringify(item));
	uni.navigateTo({
		url:'/pages/reservation/reserveForm?data='+queryString
	})
}
</script>

<style>

</style>
