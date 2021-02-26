<template>
  <div class="login_page">
    <div class="login_bg" :style="loginBgStyle"></div>
    <div class="login_nav" 
      @mouseover="handleMouseOver" 
      @mouseleave="handleMouseLeave" 
      :style="loginNavStyle"
    >
      <div class="login_box">
        <div class="title">手机商城</div>
        <el-input 
          v-model="formData.username" 
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
        ></el-input>
        <el-input 
          v-model="formData.password" 
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          show-password
        ></el-input>
        <div class="pwd_nav" v-show="isPwdShow" :style="pwdNavStyle">
          <el-input 
            v-model="formData.password1" 
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </div>
        <el-button type="primary" @click="login">{{isRegister ? "注册" : "登录"}}</el-button>
        <el-button type="text" @click="goRegister">{{isRegister ? '已有账号？去登录' :'没有账号？去注册'}}</el-button>
      </div>
    </div>
    
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import { AJAX, PATH } from "@/config";
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: "login",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const identity = {...route}.params?.id || "user"
    const data = reactive({
      isRegister: false,
      isPwdShow: false,
      formData: {
        username: '',
        password: '',
        password1: ''
      },
      loginBgStyle: { filter: '', background: '#000' },
      loginNavStyle: { height: '400px' },
      pwdNavStyle: { top: "-300px", opacity: "0" },
      goRegister: () => data.isRegister = !data.isRegister,
      handleMouseOver: () => {
        const { loginBgStyle: { filter } } = data
        if(!filter) data.loginBgStyle.filter = "blur(6.5px)"
      },
      handleMouseLeave: () => data.loginBgStyle.filter = '',
    })
    const login = async () => {
      const { formData, isRegister } = data
      const { username, password, password1 } = formData
      const id = identity === "mall" ? 0 : 1
      if(!username || !password) return ElMessage({message: '用户名或密码不可为空！', type: 'warning'})
      if(!isRegister) {
        delete formData.password1
        const { success } = await AJAX.post(`${PATH.login}/${id}`, { ...formData })
        success && setTimeout(() => {
          id === 0 ?
          router.replace('/') :
          router.replace('/manage')
        }, 1000);
      } else {
        if(password !== password1) return ElMessage({message: '两次密码不一致！', type: 'warning'})
        const { success } = await AJAX.post(`${PATH.register}/${id}`, { ...formData })
        success && setTimeout(() => {
          id === 0 ?
          router.replace('/') :
          router.replace('/manage')
        }, 1000);
      }
    }

    onMounted(() => {setTimeout(() => {data.loginBgStyle.background = ''}, 300)})
    watch(() => data.isRegister, (val) => {
      if(val) {
        data.isPwdShow = true
        data.loginNavStyle.height = '450px'
        setTimeout(() => { data.pwdNavStyle.opacity = '1' }, 300);
        setTimeout(() => { data.pwdNavStyle.top = '0' }, 800);
      }else{
        data.pwdNavStyle.top = '-300px'
        data.loginNavStyle.height = '400px'
        setTimeout(() => { data.pwdNavStyle.opacity = '0' }, 500);
        setTimeout(() => { data.isPwdShow = false }, 800);
      }
    })
    const refData = toRefs(data)
    return {
      ...refData,
      login
    }
  }
}
</script>
<style lang="scss">
  .login_page{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_bg{
      background-image: url(http://demo.kangjingept.com:8020/cssthemes5/twts_223_now-ui-login/assets/img/login.jpg);
      position: absolute;
      // background-size: cover;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center center;
      z-index: -99;
      transition: all 0.7s;
    }
    .login_nav{
      border: 1px solid #ccc;
      width: 500px;
      background-color: rgb(250, 250, 250);
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      opacity: 0.4;
      transition: all 0.7s;
      border-radius: 10px;
      .title{
        font-size: 26px;
        margin-bottom: 20px;
      }
      &:hover{
        opacity: 1;
      }
      .pwd_nav{
        position: relative;
        transition: all 1s;
      }
      .login_box{
        width: 70%;
        div{
          margin: 10px 0;
        }
        .el-button--primary{
          margin-top: 10px;
          width: 100%;
        }
      }
    }
  }
</style>