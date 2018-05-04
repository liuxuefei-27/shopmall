<template>
    <div>
      <header class="headerBox">
        <section class="headPic">
          <img src="./../assets/img/head_pic.jpg" alt="">
        </section>
        <section class="navMenu">
          <div class="navLocation">
            <a href="javascript:;">Home&nbsp;/&nbsp;</a>
            <slot></slot>
          </div>
          <div class="right_btn">
            <a href="javascript:;" @click="popFlag=true" v-if="!isLogin">Login</a>
            <span class="nickName" v-if="isLogin">{{nickName}}</span>
            <a href="javascript:;" v-if="isLogin" @click="userLogout">Logout</a>
            <a href="javascript:;" class="cartBox" @click="goToCart" v-if="isLogin && cartCount>0">
              <img src="./../assets/img/cart1.jpg" alt="" />
              <span class="cartNum">{{cartCount}}</span>
            </a>
          </div>
        </section>
      </header>
      <div class="overLay" v-if="popFlag" @click="popFlag=false"></div>
      <div class="loginBox" v-if="popFlag">
        <span class="labelTxt">Login in</span>
        <span class="errorMsg" v-if="errMsg">用户名或者密码错误!</span>
        <div class="inputTxt">
          <input type="text" class="userName" placeholder="User Name" v-model="userName" />
        </div>
        <div class="inputTxt">
          <input type="password" class="pwd" placeholder="Password" v-model="userPwd" />
        </div>
        <button class="loginBtn" @click="userLogin">登录</button>
        <span class="closeBtn" @click="popFlag=false">X</span>
      </div>
    </div>
</template>

<script>
    import './../assets/css/common.css'
    import axios from 'axios';
    import {mapState} from 'vuex'
    export default {
        name: "common-header",
        data(){
          return{
            isLogin:false,
            popFlag:false,
            errMsg:false,
            userName:'',
            userPwd:''
          }
        },
        mounted(){
          var that = this;
          that.checkLogin();
          that.getCartCount();
          document.addEventListener("keyup",function(ev){
            if(ev.keyCode == 13){
              if(that.popFlag){
                that.userLogin();
              }
            }
          })
        },
        computed:{
          /*nickName(){
            return this.$store.state.nickName;
          },
          cartCount(){
            return this.$store.state.cartCount;
          }*/
          ...mapState(['nickName','cartCount'])
        },
        methods:{
          checkLogin(){
            axios.get("/shopApi/checkLogin")
              .then(response=>{
                let res = response.data;
                if(res.status == '0'){
                  this.isLogin = true;
                  this.$store.commit("updateUserInfo",res.result);
                }else{
                  console.log(res.msg);
                  this.isLogin = false;
                }
              })
              .catch(err=>{
                console.log(err.message);
              })
          },
          userLogin(){
            if(!this.userName||!this.userPwd){
              this.errMsg = true;
              return;
            }
            axios.post("/shopApi/login",{
              userName:this.userName,
              userPwd:this.userPwd
            })
              .then(response=>{
                let res = response.data;
                if(res.status == '0'){
                  this.errMsg = false;
                  this.popFlag = false;
                  this.isLogin = true;
                  this.$store.commit("updateUserInfo",res.result.userName);
                  this.getCartCount();
                }else{
                  console.log(res.msg);
                }
              })
              .catch(err=>{
                console.log(err.message);
              })
          },
          getCartCount(){
            axios.get("/shopApi/getCartCount")
              .then(response=>{
                let res = response.data;
                if(res.status == '0'){
                  this.$store.commit("initCartCount",res.result);
                }else{
                  console.log(res.msg);
                }
              })
              .catch(err=>{
                console.log(err.message);
              })
          },
          userLogout(){
            axios.post("/shopApi/logout")
              .then(response=>{
                let res = response.data;
                if(res.status == '0'){
                  this.isLogin = false;
                  this.$store.commit("updateUserInfo",'');
                  this.$store.commit("updateCartCount",0);
                  this.$store.commit("initCartCount",0);
                }
              })
              .catch(err=>{
                console.log(err.message);
              })
          },
          goToCart(){
            this.$router.push("/cart");
          }
        }
    }
</script>
