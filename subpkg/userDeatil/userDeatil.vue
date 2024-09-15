<template>
	<view class="" style="background-color: #f9f9f9;">
		<view class=""  style="display: flex;align-items: center;padding: 10rpx;">
			<img @click="previewImage" :src="toFormModel.avatar" style="width: 150rpx;height: 150rpx;border-radius: 50%;">
			<view style="margin-left: 10rpx;font-size: 18px;font-weight: 700;">
							{{toFormModel.name}}

			</view>
			<view v-if="toFormModel.sex==='0'" style="margin-left: auto;margin-right: 80rpx;"><img src="@/static/man.png" style="width: 70rpx;height: 70rpx;" alt=""></view>
			<view v-if="toFormModel.sex==='1'" style="margin-left: auto;margin-right: 80rpx;"><img src="@/static/woman.png" style="width: 70rpx;height: 70rpx;" alt=""></view>
		</view>
		<view style="display: flex;margin: 5rpx;">
					<button
											@click="saveFollow(toFormModel.account)"
															size="mini"
															v-if="!isFollow"
															style="background-color: #00b8f6;color: #fff;width: 49.5%;"
													      >
															<span>关注</span>
													      </button>
													      <button
													        @click="cancelFollow(toFormModel.account)"
															size="mini"
															v-if="isFollow"
													        style="
													          background-color: #7f7f7f;
													          color: #fff;
															  width: 49.5%;
													        "
													      >
													        <span style="margin-left: 1rpx">已关注</span>
													      </button>
					<button size="mini" style="font-size: 13px;color: #7f7f7f;background-color: #f1f1f3;width: 49.5%;" @click="gotoChat">私信</button>
		</view>
		<view
		   v-for="(item, index) in list"
		   :key="item.id"
		   class="card"
		   style="
						margin-left: 10rpx;
		     margin-top: 30rpx;
		     border-bottom: 1rpx solid #ccc;
		     margin-bottom: 5rpx;
		     overflow: auto;
		   "
		 >
					<view class="card_head" style="display: flex">
					  <img  style="width: 100rpx;height: 100rpx; border-radius: 50%;" :src="toFormModel.avatar" />
					  <view style="margin-left: 5rpx; margin-top: 5rpx">
					    <view class="card_head_name">
						<view class="" style="display: flex;">
							<view class="">{{ toFormModel.name }}</view>
						</view>
							<view class="">{{item.createTime}}</view>
					    </view>
					   
					  </view>
					</view>
					<view class="card_body" style="margin-top: 10rpx">
					  <view>
					    <span>{{ item.descContent }}</span>
					  </view>
					  <ul style="display: flex; flex-wrap: wrap">
					    <li v-for="(item, index) in item.imgs"  :key="index">
					      <img
					        style="width: 200rpx; height: 200rpx; margin-right: 2rpx"
					        :src="item"
							@click="previewImage(item)"
					        alt=""
					      />
					    </li>
					  </ul>
					</view>
					<view class="card_bottom" style="display: flex; margin-top: 10rpx">
					  <span
					    style="font-size: 35rpx; margin-right: 7rpx"
					    @click="dyLike(index, item.id)"
					    >
						<uni-icons v-if="!item.isLike" type="hand-up" size="20"></uni-icons>
						<uni-icons v-if="item.isLike" type="hand-up-filled" size="20"></uni-icons>
						点赞:{{ item.likeCount }}</span
					  >
					  <span
					    style="font-size: 35rpx; "
					    @click="setCurrentComment(index)"
					  >
					    <span><uni-icons  type="chat" size="20"></uni-icons>评论</span></span
					  >
					</view>
					<view v-for="commont in item.comments" :key="commont.commentUserAccount">
					  <view style="margin-bottom: 5rpx; margin-top: 5rpx">
					    <span style="color: #2c5883">{{ commont.commentUserName }}</span
					    >:<span style="margin-left: 5rpx; font-size: 35rpx">{{
					      commont.commentContent
					    }}</span>
					  </view>
					</view>
					<view v-if="item.isComment" style="display: flex">
						<input type="text" v-model="commentForm.commentContent"
					    placeholder="恶语伤人心，善语结良缘~">
					  <button size="mini" style="margin-bottom: 2rpx;background-color: #00b8f6; color: #fff;" @click="publishComment(index, item.id)">发表</button>
					</view>
		 </view>
		 <view v-if='isAdd && isLoading' style="display: flex;justify-content: center;"><view>加载更多中...</view></view>
		 <view v-if='!isAdd && !isLoading' style="display: flex;justify-content: center;"><view>没有更多了...</view></view>
	
	</view>
</template>

<script setup>
import {onReady,onLoad,onShow,onPullDownRefresh,onReachBottom} from '@dcloudio/uni-app'	
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
const userStore = useUserStore()
const { user } = userStore
const followAccount = user.account;
formModel.value = user
let list = ref([])

const toFormModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})

onLoad((option) =>{
	request.get('/user/getUserByAccount?account='+option.userAccount).then(
	res=>{
		checkFollow(followAccount,option.userAccount)
		toFormModel.value = res.data.data
		data.userAccount=toFormModel.value.account
		getDynamicsPage()
	}
)
});

//私信
const gotoChat = ()=>{
	uni.navigateTo({
		 url: '/subpkg/chat/chat?userAccount='+toFormModel.value.account
	});
}

let isAdd = ref(true)
let limit = 5
let currentLimit = 0

let  data = {
	userAccount:'',
	currentLimit,
	limit
}

let isLoading = ref(false)
//列表懒加载
const getDynamicsPage = () => {
  if (!isAdd.value) {
    return
  }
  isLoading.value=true
  request.get("/dynamics/getDynamicsByUserAccount",data).then((res) => {
    if (res.data.code === 1) {
      if (res.data.data.length < limit) {
        isAdd.value = false
      } else {
        data.currentLimit=data.currentLimit+5
      }
      list.value = [...list.value, ...res.data.data]
	  isLoading.value=false
	  console.log(isAdd.value );
		checkLike()
		setComment()
    }else{
		 isAdd.value = false
		 isLoading.value =false
	}
  })
}
//点赞表单
const likeForm = ref({
  dynamicsId: '',
  userAccount: ''
})
//保存点赞信息
const dyLike = (index, id) => {
  let isLike = list.value[index].isLike
  if (!isLike) {
    likeForm.value.dynamicsId = id
    likeForm.value.userAccount = formModel.value.account
    list.value[index].likeCount = list.value[index].likeCount + 1
    list.value[index].isLike = true
    request.post('/dyLike/save',likeForm.value).then((res) => {
      console.log(res)
    })
  }
}
//检查是否点赞
const checkLike = () => {
  list.value.forEach((item, index) => {
    item.dyLikes.forEach((item) => {
      if (item.userAccount === formModel.value.account) {
        list.value[index].isLike = true
      }
    })
  })
  }
//初始化评论
const setComment = () => {
  list.value.forEach((item) => {
    item.isComment = false
  })
}
//设置当前评论
const setCurrentComment = (index) => {
  setComment()
  list.value[index].isComment = true
}
//评论表单
let commentForm = ref({
  dynamicsId: '',
  commentUserAccount: formModel.value.account,
  commentContent: '',
  commentUserName: ''
})
//发布评论表单
const publishComment = (index, id) => {
  commentForm.value.commentUserName = formModel.value.name
  commentForm.value.commentUserAccount = formModel.value.account
  commentForm.value.dynamicsId = id
  request.post('/comment/publish',commentForm.value).then((res) => {
    if (res.data.code === 1) {
      list.value[index].comments.push(commentForm.value)
      commentForm.value = {}
      console.log(list.value)
    }
  })
}
//关注表单
const followForm = ref({
  befollowUserAccount: '',
  followUserAccount: ''
})
//保存关注
const saveFollow = (befollowUserAccount) => {
  followForm.value.befollowUserAccount = befollowUserAccount
  followForm.value.followUserAccount = user.account
  request.post('/follow/saveFollow',followForm.value).then((res) => {
	  if(res.data.code==1){
		  isFollow.value=true
	  }
  })
}
let isFollow = ref(true)
//检查是否关注
const checkFollow = (followAccount,beFollowAccount) =>{
		console.log(followAccount,'ff');
		console.log(beFollowAccount,'ff');
		request.get(`/follow/checkFollow?followAccount=${followAccount}&beFollowAccount=${beFollowAccount}`)
		.then(res=>{
		if(res.data.code === 0){
			isFollow.value=false
		}
	})
}
// 取消关注
const cancelFollow = async (beFollowAccount) => {
	uni.showModal({
		title:'是否取消关注？',
		success: (res) => {
		    if (res.confirm) {
		      // 用户点击了确认按钮
		      followForm.value.befollowUserAccount = beFollowAccount
		      followForm.value.followUserAccount = formModel.value.account
			  request.delete('/follow/deleteFollow',followForm.value).then((res) => {
			    if (res.data.code === 1) {
					isFollow.value=false
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
</script>

<style>

</style>
