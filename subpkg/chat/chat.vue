<template>
	 <scroll-view style="display: flex;flex-direction: column;height: 100vh;padding-top: 20rpx;"  class="container" scroll-y="true" ref="scrollContainer"  @scrolltoupper="onScrollTop" @scroll="onScroll">
<!-- 	    <view class="messageView" style="padding: 20rpx;"> -->
	      <view v-for="(item,index) in infoList" :key="index" style="display: flex;margin-bottom: 20rpx" ref="myView">
	        <view v-if="item.from === toAccout" style="margin-right: auto;margin-left: 10rpx;display: flex;align-items: center;">
	          <img :src="toFormModel.avatar" style="width: 120rpx;height: 120rpx;border-radius: 50%;">
	          <view v-if="item.ifImg===0" style="background-color: #f5f5f5; padding: 20rpx;font-size: 15px;margin-left: 20rpx;border-radius: 10rpx;">{{item.content}}</view>
	          <view style="border-radius: 10rpx;" v-if="item.ifImg===1">
	            <image mode="aspectFill" @click="previewImage(item.img)" style="margin-left: 20rpx;width: 300rpx;height: 300rpx" :src="item.img"></image>
	          </view>
	        </view>
	        <view v-if="item.from === account" style="margin-left: auto;margin-right: 10rpx;display: flex;align-items: center;">
	          <view style="background-color: #5cd375; padding: 20rpx;font-size: 15px;margin-right: 20rpx;border-radius: 10rpx;" v-if="item.ifImg===0">{{item.content}}</view>
	          <view style="border-radius: 10rpx;" v-if="item.ifImg===1">
	            <image mode="aspectFill" @click="previewImage(item.img)" style="margin-right: 20rpx;width: 300rpx;height: 300rpx" :src="item.img"></image>
		
	          </view>
	          <img :src="formModel.avatar" style="width: 120rpx;height: 120rpx;border-radius: 50%;">
	        </view>
	      </view>
	    <!-- </view> -->
	  </scroll-view>
	  <view class="bottom" style="height: 120rpx;"></view>
	  <view class="bottom-bar">
	    <img @click="openFileSelector" src="@/static/img.png" style="width: 50rpx;height: 50rpx;margin-left: 10rpx;" alt="">
	    <input type="text" v-model="info.content" placeholder="请输入消息" class="input-box" />
	    <button type="primary" size="mini" style="margin-right: 20rpx;" class="send-btn" @click="sendMsg">发送</button>
	  </view>
	  <view class=".xxx"></view>
</template>

<script setup>
import {onReady,onLoad,onShow,onUnload} from '@dcloudio/uni-app'	
import { ref } from "vue";
import request from "@/common/request.js"
import {useUserStore} from "@/store/user.js"
import config from "@/common/config.js"

let currentTop = ref('0')
	
const onScrollTop =() =>{
	// getMessagePages()
}

const onScroll = (e)=>{
	if(e.detail.scrollTop<50){
		getMessagePages()
		uni.pageScrollTo({
		   scrollTop: 400, // 设置一个足够大的值，使页面滚动到底部
		   duration: 0,
		   success: () => {
			   currentTop.value = e.detail.scrollHeight
		     console.log('滚动成功');
		   },
		   })
	}
}
//随机id
let randomId = ref('')
randomId.value =
  Math.random().toString(36).substring(2) + Date.now().toString(36)

const formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})
const toFormModel = ref({
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

account.value = formModel.value.account

let toAccout = ref('')

	
//预览图片
const previewImage = (item)=> {
  uni.previewImage({
    urls: [item],
    current: item
  })
}

//选择图片
const openFileSelector = () =>{
    uni.chooseImage({
          success: (res) => {
            const tempFilePaths = res.tempFilePaths // 获取选择的文件路径
            const fs = uni.getFileSystemManager()
            fs.readFile({ 
              filePath: tempFilePaths[0],
              encoding: 'base64',
              success: (data) => {
                const base64 = 'data:image/png;base64,' + data.data // 获取图片对应的 base64 字符串
				info.value.img=''
				info.value.ifImg=1
				let sendInfo = Rinfo
				sendInfo.value = {}
				sendInfo.value.from = info.value.from
				sendInfo.value.content = info.value.content
				sendInfo.value.img = base64
				sendInfo.value.ifImg = 1;
				infoList.value.push(sendInfo.value)
				console.log(infoList.value,'iv');
				chatImg.value.data=base64
				chatImg.value.chatId = info.value.id
				info.value.ifImg=1
				request.post('/chat/saveImg',chatImg.value)
				uni.sendSocketMessage({
					data:JSON.stringify(info.value)
				})
              }
            })
          }
        })
  }
  
//聊天图片表单
let chatImg = ref({
	chatId:randomId.value,
  	from:'',
  	to:'',
  	data:'',
});
  
var socket = null;
//消息表单
let info = ref({
	id:randomId.value,
  	from:'',
  	to:'',
  	content:'',
	ifReceive:'',
	ifImg:0
});
//接受消息表单
let Rinfo = ref({
  	from:'',
  	content:'',
	ifImg:0
});
//通信列表
let infoList = ref([])
onReady(()=>
{
	uni.pageScrollTo({
	       scrollTop:9999,
	       duration: 0,
	       success: () => {
	         uni.pageScrollTo(
				{
					scrollTop: -20,
					duration:0
				}
			 )
	       },
	    })
}
) 
  let  page = ref({
  	fromAccount:'',
  	toAccount:'',
  	currentLimit:0,
  	limit:10
  })
onLoad((options) =>{
	infoList.value=[]
	info.value.from = formModel.value.account
	info.value.to = options.userAccount
	toAccout.value=options.userAccount
	request.get('/user/getUserByAccount?account='+options.userAccount).then(
	res=>{
		toFormModel.value = res.data.data
		uni.setNavigationBarTitle({
			title:toFormModel.value.name
		})
	})
	
	let messageForm= ref({
		fromAccount:account.value,
		toAccount:options.userAccount
	})
	
	page.value.fromAccount=account.value
	page.value.toAccount = options.userAccount

	// request.get('/chat/getMessages',messageForm.value).then(
	// res =>{
	// 	infoList.value = res.data.data
	// 	console.log(res.data.data,'res');
	// })
	
	getMessagePages()
	
    socket = uni.connectSocket({
      url: config.WS_SERVER_URL + '/imserver/'+ account.value,
	  // url:'ws://192.168.0.103:2003/imserver/202104279',
      success: res => {
		  console.log(res,'res');
          console.info('创建连接成功');
      }
	  
  });
  


 

  // console.info(socket);
  //事件监听
  socket.onOpen(function () {
      console.info('连接打开成功');
  });

  //服务器发送监听
  socket.onMessage(function (e) {
	  console.log(e.data,'ed');
	  if(e.data==='对方不在线'){
		  info.value.ifReceive = 0;
		  request.post('/chat/send',info.value)
		  info.value.content=''
		  randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36)
		   info.value.id = randomId.value
	  }
	  else if(e.data==='对方不在线且发的图片'){
		  info.value.ifImg=1
		  info.value.ifReceive=0
		  request.post('/chat/send',info.value)
		  info.value.content=''
		  info.value.ifImg=0
		  randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36)
		   info.value.id = randomId.value
		}
	  else{
		  if(e.data === '对方在线'){
			  info.value.ifReceive = 1;
			  request.post('/chat/send',info.value)
				info.value.content=''
				randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36)
				 info.value.id = randomId.value
			  return
		  }
		  if(e.data==='对方在线且发的图片'){
				info.value.ifReceive = 1;
				info.value.ifImg=1
				request.post('/chat/send',info.value)
				info.value.content=''
				info.value.ifImg=0
				randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36)
				 info.value.id = randomId.value
				 return
		  }
		  if(e.data !==''){
			  let temp = info.value.from
			  info.value.from = info.value.to
			  info.value.to = temp
			  info.value.content = e.data
			  info.value.ifReceive = 1
			  request.post('/chat/send',info.value)
			  info.value.content = ''
			  randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36)
			   info.value.id = randomId.value
			  let newRinfo = Rinfo
			  newRinfo.value=[]
			  newRinfo.value.from = toAccout.value
			  newRinfo.value.content = e.data
			  newRinfo.value.ifImg=0
			  infoList.value.push(newRinfo.value)
		  }else{
			  let messageForm= ref({
			  	fromUser:toFormModel.value.account,
			  	toUser:formModel.value.account
			  })
			request.get('/chat/getImg',messageForm.value).then(
			res=>{
				let newRinfo = Rinfo
				newRinfo.value=[]
				newRinfo.value.from = toAccout.value
				newRinfo.value.img = res.data.data
				newRinfo.value.ifImg=1
				infoList.value.push(newRinfo.value)
				console.log(res,'rr');
			})
		  }
	  }  
  });
  })
  
 let isAdd = ref(true)
 let limit = 10
 let currentLimit = 0 
 //消息懒加载
  const getMessagePages = ()=>{
	  if (!isAdd.value) {
	    return
	  }
	  request.get('/chat/getMessagePage',page.value).then(res =>{
		if (res.data.code === 1) {
	   if (res.data.data.length < limit) {
	     isAdd.value = false
	   } else {
	    page.value.currentLimit=page.value.currentLimit+10
	   }
	  infoList.value = [...res.data.data,...infoList.value]
	  console.log(infoList.value,'ive');
	 }else{
	 	 isAdd.value = false
	 }
	 })
  }

// 监听页面被卸载事件
onUnload(()=>{
	console.log("页面被卸载");
	uni.closeSocket()
	console.log("连接关闭");
})

// 发送消息
const sendMsg = ()=> {
	if(info.value.content!=='' || info.value.img!==''){
		let sendInfo = Rinfo
		sendInfo.value = []
		sendInfo.value.from = info.value.from
		sendInfo.value.content = info.value.content
		sendInfo.value.img = info.value.img
		sendInfo.value.ifImg=0
		console.log(sendInfo.value ,'sss');
		infoList.value.push(sendInfo.value)
		uni.sendSocketMessage({
			data:JSON.stringify(info.value)
		})
		uni.pageScrollTo({
		       selector: '.bottom',
		       duration: 300,
		       success: () => {
		         console.log('success')
		       },
		    })
	}

}

  
</script>

<style>
.messageView{
}
.bottom-bar {
  position: fixed;
  bottom: 0rpx; /* 底部距离 */
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
}

.input-box {
  flex: 1;
  height: 100%;
  padding: 0 10px;
  font-size: 16px;
  border: none;
  outline: none;
}
</style>
