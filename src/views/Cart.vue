<template>
  <div>
    <common-header>
      <span class="location">CART</span>
    </common-header>
    <div class="cartContent">
      <h2>MY CART</h2>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <th>ITEMS</th>
          <th>PRICE</th>
          <th>QUANTITY</th>
          <th>SUBTOTAL</th>
          <th>EDIT</th>
        </tr>
        <tr v-for="item in cartList">
          <td>
            <input type="checkbox" class="goodsCheck" :checked="item.checked==1?'checked':''" @click="editCart('checked',item)"/>
            <img :src="'./../../shop/static/'+item.productImage" :alt="item.productName" class="goodsPic" />
            <span class="goodsName">{{item.productName}}</span>
          </td>
          <td>
            <span class="goodsPrice">{{item.salePrice|currency('￥')}}</span>
          </td>
          <td>
            <button class="reduceGoods" @click="editCart('reduce',item)">-</button>
            <input type="text" value="10" class="goodsNum" v-model="item.productNum"/>
            <button class="addGoods" @click="editCart('add',item)">+</button>
          </td>
          <td>
            <span>{{(item.salePrice*item.productNum)|currency('￥')}}</span>
          </td>
          <td>
            <span class="delBtn" @click="delCartConfirm(item)"></span>
          </td>
        </tr>
      </table>
      <div class="allCartInfo">
        <section class="leftSelectAll">
          <input type="checkbox" class="selectAll" @click="checkedAll" :class="{'checked':checkAllFlag}"/>
          <span>Select all</span>
        </section>
        <section class="rightCheckout">
          <div class="priceTotal">
            <span class="checkTxt">Item total:&nbsp;&nbsp;</span>
            <span class="totalPrice">{{totalPrice|currency('￥')}}</span>
          </div>
          <button class="checkOut" @click="checkOut" :class="checkedCount>0?'':'btn-dis'">CHECKPUT</button>
        </section>
      </div>
    </div>
    <common-footer></common-footer>
    <confirm-modal :mdShow="modalConfirm" @close="closeModal" v-show="modalConfirm">
      <span class="confirmMsg" slot="message">你确认要删除此条数据吗?</span>
      <button class="modalBtn" slot="confirmBtn" @click="delCart">确认</button>
      <button class="modalBtn" slot="confirmBtn" @click="modalConfirm = false">取消</button>
    </confirm-modal>
  </div>
</template>

<script>
  import CommonHeader from '../components/CommonHeader'
  import CommonFooter from '../components/CommonFooter'
  import ConfirmModal from '../components/ConfirmModal'
  import './../assets/css/cart.css'
  import axios from 'axios'
  import {currency} from './../util/currency'
  export default {
    name: "cart",
    data(){
      return{
        cartList:[],
        modalConfirm:false,
        delItem:{},
        checkAll:false
      }
    },
    mounted(){
      this.getCart();
    },
    filters:{
      currency:currency
    },
    computed:{
      checkAllFlag(){
        return this.checkedCount == this.cartList.length;
      },
      checkedCount(){
        var i = 0;
        this.cartList.forEach(function(item){
          if(item.checked == '1'){
            i++;
          }
        });
        return i;
      },
      totalPrice(){
        var money = 0;
        this.cartList.forEach(function(item){
          if(item.checked == '1'){
            money+=parseFloat(item.salePrice)*parseInt(item.productNum);
          }
        });
        return money;
      }
    },
    components:{
      CommonHeader,
      CommonFooter,
      ConfirmModal
    },
    methods:{
      getCart(){
        axios.get("/shopApi/cart")
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              this.cartList = res.result;
            }else{
              this.cartList = [];
            }
          })
      },
      closeModal(){
        this.modalConfirm = false;
      },
      delCartConfirm(item){
        this.modalConfirm = true;
        this.delItem = item;
      },
      delCart(){
        axios.post("/shopApi/delCart",{
          productId:this.delItem.productId
        })
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              this.modalConfirm = false;
              this.getCart();
              this.$store.commit("updateCartCount",-1*parseInt(this.delItem.productNum));
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      },
      editCart(flag,item){
        if(flag == 'add'){
          item.productNum++;
        }else if(flag == 'reduce'){
          if(item.productNum<=1){
            return;
          }
          item.productNum--;
        }else{
          item.checked = item.checked == '1'?'0':'1';
        }
        axios.post("/shopApi/editCart",{
          productId:item.productId,
          productNum:item.productNum,
          checked:item.checked
        })
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              console.log(res.result);
              var num = 0;
              if(flag == 'add'){
                num = 1;
              }else if(flag == 'reduce'){
                num = -1;
              }
              this.$store.commit("updateCartCount",num);
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      },
      checkedAll(){
        this.checkAll = !this.checkAll;
        axios.post("/shopApi/checkAllCart",{
          checkAll:this.checkAll
        })
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              this.getCart();
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      },
      checkOut(){
        if(this.checkedCount>0){
          this.$router.push({
            path:'/address'
          });
        }
      }
    }
  }
</script>
