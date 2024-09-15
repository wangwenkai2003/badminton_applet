<template>
	<view class="Index">
		<view @click="hanldeRelease" style="width: 45px;height: 45px; font-size: 35px;border-radius: 50%;border: #f4f4f4 1px solid;line-height: 45px;text-align: center;background-color: #f9e650;position: fixed;right: 8%;bottom: 5%;">+</view>
		<view style="margin: 10rpx;padding: 10rpx;border: 2px solid #f4f4f4;border-radius: 10px;display: flex;align-items: center;"><uni-icons type="search" size="30"></uni-icons>
		<input class="uni-input"  placeholder="搜索装备" /></view>
		<!-- 瀑布流布局列表 -->
		<view class="pubuBox">
			<view class="pubuItem">
				<view class="item-masonry" v-for="(item, index) in list" :key="index" >
					<image @click="handleDetail(item)" :src="item.imgs[0]" mode="widthFix"></image>
					<view class="listtitle"> <!-- 这是没有高度的父盒子（下半部分） -->
						<view class="listtitle1">{{ item.title }}</view>
						<view class="listtitle2">
							<text class="listtitle2son">￥</text>
							{{ item.price }}
						</view>
						<view class="listtitle3">
							{{item.user.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import {onReady,onLoad,onShow} from '@dcloudio/uni-app'
import request from "../../common/request";
let comList = ref([]) //商品列表)

onShow(()=>{
	list.value=[]
	getEquiptments()
})
			
//获取装备列表
let equiptmentList= ref([])

let isAdd = ref(true)
let limit = 5
let currentLimit = 0

let  data = {
	currentLimit,
	limit
}
let list = ref([])

const getEquiptments= ()=>{
	request.get('/equiptment/get',data).then(
		res =>{
			if (res.data.code === 1) {
			  if (res.data.data.length < limit) {
			    isAdd.value = false
			  } else {
			    data.currentLimit=data.currentLimit+5
			  }
			  list.value = [...list.value, ...res.data.data]
			}else{
				 isAdd.value = false
			}
		}
	)
}
//跳转发布				
const hanldeRelease = ()=>{
	uni.navigateTo({
		url:"/pages/community/equiptmentRelease"
	})
}
//跳转详情
const handleDetail = (item)=>{
	console.log(item,'ssss');
	uni.navigateTo({
		url:"/pages/community/equiptmentDetail?equiptment="+ encodeURIComponent(JSON.stringify(item))
	})
}
</script>

<style scoped="scoped" lang="scss">
	//瀑布流
	page {
		background-color: #eee;
		height: 100%;
	}

	.pubuBox {
		padding: 22rpx;
	}

	.pubuItem {
		column-count: 2;
		column-gap: 20rpx;
	}

	.item-masonry {
		box-sizing: border-box;
		border-radius: 15rpx;
		overflow: hidden;
		background-color: #fff;
		break-inside: avoid;
		/*避免在元素内部插入分页符*/
		box-sizing: border-box;
		margin-bottom: 20rpx;
		box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);
	}

	.item-masonry image {
		width: 100%;
	}

	.listtitle {
		padding-left: 22rpx;
		font-size: 24rpx;
		padding-bottom: 22rpx;

		.listtitle1 {
			line-height: 39rpx;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			min-height: 39rpx;
			max-height: 78rpx;
		}

		.listtitle2 {
			color: #ff0000;
			font-size: 32rpx;
			line-height: 32rpx;
			font-weight: bold;
			padding-top: 22rpx;

			.listtitle2son {
				font-size: 32rpx;
			}
		}

		.listtitle3 {
			font-size: 28rpx;
			color: #909399;
			line-height: 32rpx;
			padding-top: 22rpx;
		}
	}

	.Index {
		width: 100%;
		height: 100%;
	}
</style>

