<template>
  <div>
    <common-header>
      <span class="location">Confirm Address</span>
    </common-header>
    <common-process :activeIndex="1"></common-process>
    <div class="addressContent">
      <h2>SHOPPING ADDRESS</h2>
      <div class="addressBox">
        <ul>
          <li v-for="(item,index) in addressListFilter" :class="{'check':checkIndex==index}" @click="checkIndex=index;addressId=item.addressId;">
            <div class="addressLeft">
              <span class="goodsName">{{item.userName}}</span>
              <span class="address">{{item.streetName}}</span>
              <span class="orderId">{{item.postCode}}</span>
              <span class="activeAddress" @click="setDefault(item.addressId)">{{item.isDefault?'Default address':'Set default'}}</span>
            </div>
            <div class="addressRight">
              <span class="delStatus" @click="delAddressConfirm(item)"></span>
            </div>
          </li>
          <li>
            <div class="addAddress">
              <span class="addAddressBtn">+</span>
              <span>Add new Address</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <span class="moreBtn" @click="getMore">查看更多{{expand?'&#8593;':'&#8595;'}}</span>
    <div class="shopMethod">
      <h2>SHOPPING METHOD</h2>
      <div class="methodBox">
        <ul>
          <li>
            <span class="methodName">Standard shopping</span>
            <span class="methodPrice">Free</span>
            <span class="methodInfo">Once shipped，Order should arrive in the destination in 1-7 business days</span>
          </li>
        </ul>
        <button class="nextBtn" @click="goToOrderConfirm">NEXT</button>
      </div>
    </div>
    <common-footer></common-footer>
    <confirm-modal :mdShow="modalConfirm" @close="closeModal" v-show="modalConfirm">
      <span class="confirmMsg" slot="message">你确认要删除此地址?</span>
      <button class="modalBtn" slot="confirmBtn" @click="delAddress">确认</button>
      <button class="modalBtn" slot="confirmBtn" @click="modalConfirm = false">取消</button>
    </confirm-modal>
  </div>
</template>

<script>
  import CommonHeader from '../components/CommonHeader'
  import CommonFooter from '../components/CommonFooter'
  import CommonProcess from '../components/CommonProcess'
  import ConfirmModal from "../components/ConfirmModal";
  import './../assets/css/address.css'
  import axios from 'axios'
  export default {
    data(){
      return{
        limit:3,
        checkIndex:0,
        expand:false,
        addressList:[],
        modalConfirm:false,
        delItem:{},
        addressId:'100001'
      }
    },
    mounted(){
      this.getAddressList();
    },
    computed:{
      addressListFilter(){
        return this.addressList.slice(0,this.limit);
      }
    },
    components:{
      ConfirmModal,
      CommonHeader,
      CommonFooter,
      CommonProcess,
      ConfirmModal
    },
    methods:{
      getAddressList(){
        axios.get("/shopApi/addressList")
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              this.addressList = res.result;
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      },
      getMore(){
        this.expand = !this.expand;
        if(this.expand){
          this.limit = this.addressList.length;
        }else{
          this.limit = 3;
        }
      },
      setDefault(addressId){
        axios.post("/shopApi/setDefault",{
          addressId:addressId
        })
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              console.log(res.result);
              this.getAddressList();
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      },
      closeModal(){
        this.modalConfirm = false;
      },
      delAddressConfirm(item){
        this.modalConfirm = true;
        this.delItem = item;
      },
      delAddress(){
        this.modalConfirm = false;
        axios.post("/shopApi/delAddress",{
          addressId:this.delItem.addressId
        })
          .then(response=>{
            let res = response.data;
            if(res.status == '0'){
              console.log(res.result);
              this.getAddressList();
            }else{
              console.log(res.msg);
            }
          })
          .catch(err=>{
            console.log(err.message);
          })
      },
      goToOrderConfirm(){
        this.$router.push({
          path:'/orderConfirm',
          query:{
            addressId:this.addressId
          }
        });
      }
    }
  }
</script>
