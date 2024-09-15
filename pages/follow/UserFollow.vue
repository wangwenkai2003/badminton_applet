<script setup>
import {useUserStore} from "@/store/user.js"
import request from "@/common/request.js"
import { onMounted, ref } from 'vue'
import {onShow,onLoad} from '@dcloudio/uni-app'

let followData = ref({})
onLoad((options)=>{
	// console.log(options);
	followData.value = JSON.parse(options.data)
	// console.log(followData.value);
	if(followData.value.type==='follow'){
		getMyFollow(followData.value.account)
	}
	if(followData.value.type==='beFollow'){
		uni.setNavigationBarTitle({
			title:'粉丝'
		})
		getMyBeFollow(followData.value.account)
	}
})
	

//关注列表
let followList = ref([])

//获取关注列表
const getMyFollow = (account) => {
  request.get('/follow/getMyFollow?userAccount='+account).then((res) => {
    if (
      res.data.data !== null &&
      res.data.data !== undefined &&
      res.data.data.length > 0
    ) {
      followList.value = res.data.data
    } else {
      followList.value = []
    }
  })
} 
//获取粉丝列表
const getMyBeFollow = (account) => {
  request.get('/follow/getMyBeFollow?userAccount='+account).then((res) => {
    if (
      res.data.data !== null &&
      res.data.data !== undefined &&
      res.data.data.length > 0
    ) {
      followList.value = res.data.data
	  console.log(followList.value);
    } else {
      followList.value = []
    }
  })
} 
//关注表单
const followForm = ref({
  befollowUserAccount: '',
  followUserAccount: ''
})
// 取消关注
const cancelFollow = async (item) => {
	uni.showModal({
		title:'是否取消关注？',
		success: (res) => {
		    if (res.confirm) {
		      // 用户点击了确认按钮
		      followForm.value.befollowUserAccount = item.account
		      followForm.value.followUserAccount = followData.value.account
			  request.delete('/follow/deleteFollow',followForm.value).then((res) => {
			    if (res.data.code === 1) {
					getMyFollow(followData.value.account)
			    }
			  })
		    } else if (res.cancel) {
		      // 用户点击了取消按钮
		      // 可以添加取消操作的代码
		    }
		  }
	})
}
const saveFollow = (item) => {
	console.log(item.account);
  followForm.value.befollowUserAccount = item.account
  followForm.value.followUserAccount = followData.value.account
  request.post('/follow/saveFollow',followForm.value).then((res) => {
    if (res.data.code === 1) {
		getMyBeFollow(followData.value.account)
    }
  })
}
//跳转到用户页面
const gotoUserDetail =(item)=>{
	uni.navigateTo({
		url: '/subpkg/userDeatil/userDeatil?userAccount='+item.account,
		success: res => {},
		fail: () => {},
		complete: () => {}
	});
}
</script>
<template>
  <view style="padding: 5px; display: flex; flex-wrap: wrap;justify-content: space-around;">
		<view class="" v-for="item in followList" :key="item.account" style="display: flex;flex-direction: column;align-items: center;">
			<img  @click = "gotoUserDetail(item)" :src="item.avatar" style="width: 150rpx;height: 150rpx;border-radius: 50%;" alt="" >
			<view @click = "gotoUserDetail(item)" class=""><span style="color: #4e8ac4;">{{item.name}}</span></view>
			<button v-if="followData.type === 'follow' || item.follow" @click="cancelFollow(item)" size="mini">取消关注</button>
			<button style="background-color: #00b8f6;" v-if="followData.type === 'beFollow' && !item.follow" @click="saveFollow(item)" size="mini" type="primary">关注</button>
		</view>
  </view>
</template>
