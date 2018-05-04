<template>
  <div>
    <div class="confirmBox" :class="{'mdShow':mdShow}">
      <div class="confirmModal">
        <span class="closeBtn" @click="closeModal">X</span>
        <div class="modalContent">
          <div class="confirmMessage">
            <slot name="message"></slot>
          </div>
          <div class="confirmBtn">
            <slot name="confirmBtn"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="confirmOverLay" v-if="mdShow" @click="closeModal"></div>
  </div>
</template>
<style>

</style>
<script>
  import './../assets/css/ConfirmModal.css'
  export default{
    name:"confirm-modal",
    props:["mdShow"],
    data(){
      return{
        msg:'hello vue'
      }
    },
    methods:{
      closeModal(){
        this.$emit("close");
      }
    }
  }
</script>
