<template>
	<view>
		<view class="" style="display: flex;justify-content: center;margin-top: 20rpx;">
					<img src="@/static/badminton.svg" alt="" style="width: 150rpx;height: 150rpx;" srcset="">
				</view>
		<view style="display: flex;flex-direction: column;align-items: center;">
			<view>
				<input v-if="isRegister" class="form-item"  type="number"  placeholder="请输入姓名" v-model="formModel.name">
				<input class="form-item"  type="number"  placeholder="请输入账号" v-model="formModel.account">
				<input class="form-item" type="password" placeholder="请输入密码" v-model="formModel.password">
				<input v-if="isRegister" class="form-item" type="password" placeholder="请确认密码" v-model="formModel.repassword">
				<view  v-if="isRegister" class="form-item" style="border: none;display: flex;">
					<input v-if="isRegister" class="form-item"  placeholder="请输入验证码" v-model="formModel.code"><img @click="getCode" style="width: 150rpx;height: 80rpx;" :src="codeImgae" alt=""></view>
				<button  v-if="!isRegister" type="primary" @click="onSubmit">登录</button>
				<button v-if="isRegister" type="primary" @click="submitRegest">注册</button>
			</view>
			
		</view>
		<view style="display: flex;justify-content:space-between;color: #c3c3c3;"> <view  style="margin-left: 40rpx;">忘记密码</view> <view v-if="!isRegister" style="margin-right: 20rpx;" @click="register">注册</view><view v-if="isRegister" style="margin-right: 20rpx;" @click="register">登录</view> </view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import request from '@/common/request.js'
import {useUserStore} from '@/store/user.js'
import defalutAvatar from '@/common/defalutAvatar.js'

//判断是否注册
let isRegister =  ref(false)

let formModel=ref({
	account:'',
	password:'',
	repassword:''
})
const userSotre = useUserStore()

let codeImgae= ref('')
//切换注册页面
const register =()=>{
	isRegister.value = true
	formModel.value={}
	getCode()
}

//获取验证码
const getCode = ()=>{
	request.get('/user/captcha').then(result =>{
		formModel.value.key = result.data.data[0]
		codeImgae.value = result.data.data[1]
	})
}
//提交注册表单
const submitRegest= () =>{
	request.post('/user/register',formModel.value).then(
		result =>{
			console.log(result);
			if(result.data.code ===1){
				formModel.value.avatar = defalutAvatar
				userSotre.setUser(formModel.value)
				userSotre.setToken(result.data.data)
				uni.switchTab({
					url:'/pages/home/home',
				})
				uni.showToast({
					title:"登录成功",
					icon:'success'
				})
			}
		}
	)
}

let isAccountValid =ref(true)
const onSubmit = (e) => {
      e.preventDefault();
		if(checkForm()){
			request.post("/user/login",formModel.value).then(
							(result) =>{
								if(result.data.code===1){
									if(result.data.data.avatar ==='' || result.data.data.avatar===undefined){
										result.data.data.avatar=defalutAvatar
									}
					
									userSotre.setToken(result.data.data.token)
									userSotre.setUser(result.data.data)
									uni.switchTab({
										url:'/pages/home/home',
									})
									uni.showToast({
										title:"登录成功",
										icon:'success'
									})
								}else{
									uni.showToast({
										title:"账号或密码有误",
										icon:'error'
									})
								}
					})
		}
    }
const checkForm = ()=>{
	if(isRegister.value === false){
		if(formModel.value.account.trim().length === 0){
				 uni.showToast({
				 	title:"账号不能为空",
					icon:'error'
				 })
				 return false
		}
		else if(formModel.value.password.trim().length === 0){
				 uni.showToast({
				 	title:"密码不能为空",
					icon:'error'
				 })
				 return false
		}else{
			return true;
		}
	}else{
		if(formModel.value.account.trim().length === 0){
				 uni.showToast({
				 	title:"账号不能为空",
					icon:'error'
				 })
				 return false
		}
		else if(formModel.value.password.trim().length === 0){
				 uni.showToast({
				 	title:"密码不能为空",
					icon:'error'
				 })
				 return false
		}else if(formModel.value.repassword.trim().length === 0){
			uni.showToast({
				title:"确认密码不能为空",
				icon:'error'
			})
			return false
		}else if(formModel.value.repassword.trim() !== formModel.value.password.trim()){
			uni.showToast({
				title:"两次密码不一致",
				icon:'error'
			})
			return false
		}else{
			return true
		}
	}
	 if(formModel.value.account.trim().length === 0){
		 uni.showToast({
		 	title:"账号不能为空",
			icon:'error'
		 })
	 }
	 else if(formModel.value.password.trim().length === 0){
		 uni.showToast({
		 	title:"密码不能为空",
			icon:'error'
		 })
	 }else{
		 request.post("/user/login",formModel.value).then(
			(result) =>{
				console.log(result);
				if(result.data.code===1){
					userSotre.setToken(result.data.data.token)
					userSotre.setUser(result.data.data)
					uni.switchTab({
						url:'/pages/home/home',
					})
					uni.showToast({
						title:"登录成功",
						icon:'success'
					})
				}else{
					uni.showToast({
						title:"账号或密码有误",
						icon:'error'
					})
				}
			}
		 )
		 
	 }
}	
	

	
</script>

<style>

.form-item{
	margin-bottom: 5rpx;
	padding: 5rpx;
	line-height: 80rpx;
	height: 80rpx;
	border: 1px #f4f4f4 solid;
}
</style>