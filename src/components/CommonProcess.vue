<template>
    <div>
      <div class="statusBox">
        <section class="statusMenu">
          <ul>
            <li :class="activeIndex==1||activeIndex==2||activeIndex==4?'activeStatus':'defaultStatus'">
              <span>Confirm Address</span>
              <span :class="['statusCircle',activeIndex==1||activeIndex==2||activeIndex==4?'activeCircle':'defaultCircle']"></span>
            </li>
            <li :class="activeIndex==2||activeIndex==4?'activeStatus':'defaultStatus'">
              <span>View Your Order</span>
              <span :class="['statusCircle',activeIndex==2||activeIndex==4?'activeCircle':'defaultCircle']"></span>
            </li>
            <li :class="activeIndex==4?'activeStatus':'defaultStatus'">
              <span>Make Payment</span>
              <span :class="['statusCircle',activeIndex==4?'activeCircle':'defaultCircle']"></span>
            </li>
            <li :class="activeIndex==4?'activeStatus':'defaultStatus'">
              <span>Order Confirmation</span>
              <span :class="['statusCircle',activeIndex==4?'activeCircle':'defaultCircle']"></span>
            </li>
          </ul>
        </section>
      </div>
    </div>
</template>

<script>
  import './../assets/css/process.css'
    export default {
        name: "common-process",
        props:["activeIndex"],
        data(){
          return{

          }
        }
    }
</script>
