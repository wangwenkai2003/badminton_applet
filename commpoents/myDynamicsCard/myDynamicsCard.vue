<template>
	<scroll-view>
		<view style="padding: 5px;" >
			<!-- <input type="text" style="border: 1px #ccc solid;padding: 10rpx"  > -->
			<view width="100%"><textarea style="padding: 5px;border: 1px #ccc solid; width: 100%; border-radius: 5px;"  name="" id="" cols="30" rows="10" v-model="form.descContent" placeholder="分享此刻~"></textarea></view>
			<ul style="display: flex;flex-wrap: wrap;">
				<li @tap="openFileSelector(index)" style="margin: 5rpx;" v-for="(item,index) in imgList" :key="index">
					<view class="" style="position: relative;">
						<img :src="item"  alt="" style="width: 200rpx;height: 200rpx;margin-bottom: 10rpx;">
						<span v-if="index !== imgList.length-1" style="color: #ccc;position: absolute;right: 10%; top: 0;" @click="deleteImg(item)">x</span>
					</view>
					</li>
			</ul>
			<view class=""><button type="primary" size="default" @click="publish">发表</button></view>
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
			  <img  style="width: 100rpx;height: 100rpx; border-radius: 50%;" :src="formModel.avatar" />
			  <view style="margin-left: 5rpx; margin-top: 5rpx">
			    <view class="card_head_name">
				<view class="" style="display: flex;">
					<view class="">{{ formModel.name }}</view>
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
	</scroll-view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import request from "@/common/request.js"
import {useUserStore} from "@/store/user.js"
import {onReady,onLoad,onShow,onPullDownRefresh,onReachBottom} from '@dcloudio/uni-app'
import imgAdd from '@/common/addImg.js'


let list = ref([])

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
onPullDownRefresh(()=>{
	list=ref([])
	getDynamicsPage()
	uni.stopPullDownRefresh()
})
onShow(()=>
	{
		const userStore = useUserStore()
		const { token } = userStore
		if(token===''){
				uni.navigateTo({
				url:'/pages/my/my-login'
				})
			}
		else{
			const { user } = userStore
			formModel.value = user
			data.userAccount = formModel.value.account
			getDynamicsPage()
		}	
	}
)

//动态图片列表
let imgList = ref([imgAdd])

//选择头像
const openFileSelector = (index) =>{
	if(index === imgList.value.length-1){
    uni.chooseImage({
          success: (res) => {
            const tempFilePaths = res.tempFilePaths // 获取选择的文件路径
            const fs = uni.getFileSystemManager()
            fs.readFile({
              filePath: tempFilePaths[0],
              encoding: 'base64',
              success: (data) => {
                const base64 = 'data:image/png;base64,' + data.data // 获取图片对应的 base64 字符串
				imgList.value[index] = base64
				imgList.value.push(imgAdd)
              }
            })
          }
        })
		}
  }
 
//预览图片
const previewImage = (item)=> {
    uni.previewImage({
      urls: [item],
      current: item
    })
  }
  


let isAdd = ref(true)
let limit = 5
let currentLimit = 0

let  data = {
	userAccount:'',
	currentLimit,
	limit
}
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
		checkLike()
		setComment()
		getMyFollow()
    }else{
		 isAdd.value = false
		 isLoading.value =false
	}
  })
}

let isLoading = ref(false)
onReachBottom(()=>{
	getDynamicsPage()
	uni.stopPullDownRefresh()
})

//随机id
let randomId = ref('')
randomId.value =
  Math.random().toString(36).substring(2) + Date.now().toString(36)

//删除动态图片
const deleteImg = (item)=>{
 imgList.value =imgList.value.filter(elem => elem !== item);
}

//动态表单
let form = ref({
  descContent: '',
  userAccount: formModel.value.account,
  id: randomId.value
})
//发表动态
const publish =()=>{
	imgList.value.pop()
	form.value.images = imgList.value
	request.post('/dynamics/appPublish',form.value).then(
	res=>{
		randomId.value =Math.random().toString(36).substring(2) + Date.now().toString(36)
		if(res.data.code===1){
			form.value.descContent=''
			form.value.id = randomId.value
			imgList.value = []
			imgList.value.push(imgAdd)
			getDynamicsPage()
			uni.showToast({
				title:'发布成功'
			})
		}
	}
		
	)
}

defineExpose({
  getDynamicsPage
})
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
    }
  })
}
//关注表单
const followForm = ref({
  befollowUserAccount: '',
  followUserAccount: ''
})
//保存关注
const saveFollow = (befollowUserAccount, index) => {
  followForm.value.befollowUserAccount = befollowUserAccount
  followForm.value.followUserAccount = formModel.value.account
  request.post('/follow/saveFollow',followForm.value).then((res) => {
    list.value.forEach((item) => {
      if (item.userAccount === list.value[index].userAccount) {
        item.isFollow = true
      }
    })
  })
}
//关注列表
let followList = ref([])
//获取关注列表
const getMyFollow = () => {
  request.get('/follow/getMyFollow?userAccount='+formModel.value.account).then((res) => {
    if (
      res.data.data !== null &&
      res.data.data !== undefined &&
      res.data.data.length > 0
    ) {
      followList.value = res.data.data
      checkFollow()
    }
  })
}
//检查是否关注
const checkFollow = () => {
  list.value.forEach((item) => {
    followList.value.forEach((follow) => {
      if (item.userAccount === follow.account) {
        item.isFollow = true
      }
    })
  })
}
// 取消关注
const cancelFollow = async (item) => {
	uni.showModal({
		title:'是否取消关注？',
		success: (res) => {
		    if (res.confirm) {
		      // 用户点击了确认按钮
		      followForm.value.befollowUserAccount = item.userAccount
		      followForm.value.followUserAccount = formModel.value.account
			  request.delete('/follow/deleteFollow',followForm.value).then((res) => {
			    if (res.data.code === 1) {
			      list.value.forEach((item, index) => {
			        if (item.userAccount === list.value[index].userAccount) {
			          item.isFollow = false
			        }
			      })
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
