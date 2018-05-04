<template>
  <div>
    <common-header>
      <span class="location">Goods</span>
    </common-header>
    <div class="filterBox">
      <section class="filterMenu">
        <div class="filter">
          <span class="labelText">Sort by:</span>
          <a href="javascript:;" class="activeBtn" @click="sortGoods">Order</a>
          <a href="javascript:;" class="labelText" @click="showFiterByPop">Price</a>
        </div>
        <div class="priceFilter" v-show="filterBy">
          <section>
            <ul>
              <li :class="curChecked=='all'?'curActive':''" @click="setPriceFilter('all')">All</li>
              <li v-for="(price,index) in priceFilter" :class="curChecked==index?'curActive':''" @click="setPriceFilter(index)">{{price.startPrice}}-{{price.endPrice}}</li>
            </ul>
          </section>
        </div>
      </section>
    </div>
    <div class="mainContent">
      <aside class="mainLeft">
        <h2>PRICE:</h2>
        <section>
          <ul>
            <li :class="curChecked=='all'?'curActive':''" @click="setPriceFilter('all')">All</li>
            <li v-for="(price,index) in priceFilter" :class="curChecked==index?'curActive':''" @click="setPriceFilter(index)">{{price.startPrice}}-{{price.endPrice}}</li>
          </ul>
        </section>
      </aside>
      <article class="mainRight">
        <section>
          <ul class="clearFix">
            <li v-for = "item in goodsList">
              <img v-lazy="'./../../shop/static/'+item.productImage" :alt="item.productName">
              <span class="goodsTitle">{{item.productName}}</span>
              <span class="goodsPrice">{{item.salePrice|currency('￥')}}</span>
              <button class="addCart" @click="addCart(item.productId)">加入购物车</button>
            </li>
          </ul>
          <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
            <img src="./../../static/loading/loading-spin.svg" alt="" v-show="loading"/>
          </div>
        </section>
      </article>
    </div>
    <common-footer></common-footer>
    <div class="overLay" v-show="overLayFlag" @click="closePop"></div>
  </div>
</template>

<script>
    import CommonHeader from '../components/CommonHeader'
    import CommonFooter from '../components/CommonFooter'
    import './../assets/css/goodsList.css'
    import axios from 'axios'
    import {currency} from './../util/currency'

    export default {
        name: "goods-list",
        data(){
          return{
            goodsList:[],
            priceFilter:[
              {
                startPrice:0.00,
                endPrice:100.00
              },
              {
                startPrice:100.00,
                endPrice:500.00
              },
              {
                startPrice:500.00,
                endPrice:1000.00
              },
              {
                startPrice:1000.00,
                endPrice:2000.00
              }
            ],
            curChecked:'all',
            filterBy:false,
            overLayFlag:false,
            sortFlag:true,
            page:1,
            pageSize:8,
            busy:true,
            loading:false
          }
        },
        mounted(){
          this.getGoodsList();
        },
        filters:{
          currency:currency
        },
        components:{
          CommonHeader,
          CommonFooter
        },
        methods:{
          getGoodsList(flag){
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.curChecked
            };
            this.loading = true;
            axios.get("/shopApi/list",{
              params:param
            })
              .then(response=>{
                var res = response.data;
                this.loading = false;
                if(res.status == '0'){
                  if(flag){
                    this.goodsList = this.goodsList.concat(res.result.list);
                    if(res.result.count == 0){
                      this.busy = true;
                    }else{
                      this.busy = false;
                    }
                  }else{
                    this.goodsList = res.result.list;
                    this.busy = false;
                  }
                }else{
                  this.goodsList = [];
                }
              })
              .catch(err=>{
                console.log(err);
                this.loading = false;
              })
          },
          addCart(productId){
            axios.post("/shopApi/addCart",{
              productId:productId
            })
              .then(response=>{
                var res = response.data;
                if(res.status == '0'){
                  alert(res.result);
                  this.$store.commit("updateCartCount",1);
                }else{
                  alert(res.msg);
                }
              })
              .catch((err)=>{
                console.log(err.message);
              })
          },
          loadMore(){
            this.busy = true;
            setTimeout(()=>{
              this.page++;
              this.getGoodsList(true);
            },500);
          },
          sortGoods(){
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.getGoodsList();
          },
          showFiterByPop(){
            this.overLayFlag=true;
            this.filterBy=true;
          },
          setPriceFilter(index){
            this.curChecked=index;
            this.closePop();
            this.page = 1;
            this.getGoodsList();
          },
          closePop(){
            this.overLayFlag=false;
            this.filterBy=false;
          }
        }
    }
</script>
