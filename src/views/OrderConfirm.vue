<template>
  <div>
    <common-header>
      <span class="location">View Your Order</span>
    </common-header>
    <common-process :activeIndex="2"></common-process>
    <div class="orderContent">
      <h2>ORDER CONTENT</h2>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <th>ORDER CONTENTS</th>
          <th>PRICE</th>
          <th>QUANTITY</th>
          <th>SUBTOTAL</th>
        </tr>
        <tr v-for="item in cartList" v-if="item.checked=='1'">
          <td>
            <img :src="'./../../shop/static/'+item.productImage" :alt="item.productName" class="goodsPic" />
            <span class="goodsName">{{item.productName}}</span>
          </td>
          <td>
            <span class="goodsPrice">{{item.salePrice|currency('￥')}}</span>
          </td>
          <td>
            <span class="goodsNum1">X{{item.productNum}}</span>
          </td>
          <td>
            <span>{{parseFloat(item.salePrice)*parseInt(item.productNum)|currency('￥')}}</span>
          </td>
        </tr>
      </table>
      <div class="orderInfo">
        <section class="orderInfoLeft">
          <button class="previousBtn" @click="backTo">PREVIOUS</button>
        </section>
        <section class="orderInfoRight">
          <span class="itemSubtotal">Item subtotal:{{subTotal|currency('￥')}}</span>
          <span class="shop">Shipping:{{Shipping|currency('￥')}}</span>
          <span class="discount">Discount:{{Discount|currency('￥')}}</span>
          <span class="tax">Tax:{{Tax|currency('￥')}}</span>
          <span class="orderTotal">Order total:{{orderTotal|currency('￥')}}</span>
          <button class="paymentBtn" @click="payMent">PROCEED TO PAYMENT</button>
        </section>
      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import CommonHeader from './../components/CommonHeader'
  import CommonFooter from './../components/CommonFooter'
  import CommonProcess from './../components/CommonProcess'
  import './../assets/css/orderConfirm.css'
  import axios from 'axios'
  import {currency} from './../util/currency'
  export default {
    name: "order-confirm",
    data(){
      return{
        cartList:[],
        Shipping:100,
        Discount:200,
        Tax:400,
        subTotal:0,
        orderTotal:0
      }
    },
    mounted(){
      this.getCartList();
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
      getCartList(){
        axios.get("/shopApi/cart")
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              this.cartList = res.result;
              this.cartList.forEach(item=>{
                if(item.checked == '1'){
                  this.subTotal+=item.salePrice*item.productNum;
                }
              });
              this.orderTotal = this.subTotal+this.Shipping-this.Discount+this.Tax;
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      },
      backTo(){
        this.$router.push({
          path:'/address'
        });
      },
      payMent(){
        var addressId = this.$route.query.addressId;
        axios.post("/shopApi/payMent",{
          addressId:addressId,
          orderTotal:this.orderTotal
        })
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              console.log('订单生成成功！');
              this.$router.push({
                path:'/orderSuccess',
                query:{
                  orderId:res.result.orderId
                }
              });
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      }
    }
  }
</script>
