<template>
  <div>
    <common-header>
      <span class="location">Order Confirmation</span>
    </common-header>
    <common-process :activeIndex="4"></common-process>
    <div class="orderConfirmation">
      <img src="./../../static/ok-2.png" alt="" class="orderOk" />
      <span class="processMsg">Congratulations!</span>
      <span class="processMsg">Your order is under processing!</span>
      <span class="orderMessage">Order ID：{{orderId}} Order total：{{orderTotal|currency('￥')}}</span>
      <div class="goBtn">
        <button class="cartList" @click="toCartList">CART LIST</button>
        <button class="goodsList" @click="toGoodsList">GOODS LIST</button>
      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import CommonHeader from '../components/CommonHeader'
  import CommonFooter from '../components/CommonFooter'
  import CommonProcess from './../components/CommonProcess'
  import './../assets/css/orderSuccess.css'
  import axios from 'axios'
  import {currency} from './../util/currency'
  export default {
    name: "order-success",
    data(){
      return{
        orderId:'',
        orderTotal:0
      }
    },
    mounted(){
      var orderId = this.$route.query.orderId;
      if(!orderId){
        return;
      }
      axios.get("/shopApi/orderDetail",{
        params:{
          orderId:orderId
        }
      })
      .then(response=>{
        let res = response.data;
        if(res.status == '0'){
          this.orderId = res.result.orderId;
          this.orderTotal = res.result.orderTotal;
        }else{
          console.log(res.msg);
        }
      })
      .catch(err=>{
        console.log(err.message);
      })
    },
    filters:{
      currency:currency
    },
    components:{
      CommonHeader,
      CommonFooter,
      CommonProcess
    },
    methods:{
      toCartList(){
        this.$router.push({
          path:'/cart'
        });
      },
      toGoodsList(){
        this.$router.push({
          path:'/'
        });
      }
    }
  }
</script>
