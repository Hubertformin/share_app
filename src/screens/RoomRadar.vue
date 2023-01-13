<template>
<div class="body px-4 pt-8 h-screen flex justify-center items-center w-full">
  <div class="head text-center">
    <h1 class="text-3xl mb-1 font-bold text-white">{{activeShareRoom.name}}</h1>
    <p class="font-bold">Passcode: {{activeShareRoom.passcode}}</p>
  </div>
  <div class="load">
<!--    <div class="green-scanner"></div>-->
  </div>

  <div class="foot">
    <p class="text-medium">Waiting for people to join...</p>
  </div>
</div>
</template>

<script lang="ts">
import {mapState} from "vuex";
import {defineComponent} from "vue";

export default defineComponent({
  name: "RoomRadar",
  computed: {
    ...mapState(['activeShareRoom'])
  }
})
</script>

<style scoped lang="scss">
$bg-color: #101c3d;
.body {
  background-color: $bg-color;
}

.head {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}

.foot {
  position: absolute;
  color: white;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.green-scanner {
  /* 	design the green scanner 40px smaller than the outer-circle */
  width: 200px;
  height: 200px;
  border-radius: 50%;

  /* 	center this green-scanner inside the parent */
  position: absolute;
  left: 50%;
  top: 50%;
  // transform: translate(-50%, -50%);

  /* 	set the background resembling a scanner */
  background: conic-gradient(
      from 0.25turn at 50% 50%,
      #29ec51, 5deg,
      $bg-color, 355deg,
      Chartreuse);

  /* 	define animation properties and set its easing to linear (default 'ease' doesn't look natural) */
  animation: scan 4s infinite linear;
}

/* the loader */

.load {
  margin: 150px auto;
  width: 200px;
  height: 200px;
  /** height is required as absolute value **/
  background-color: #80c5f0;
  border-radius: 100px;
  position:relative;
  animation: pulse 2000ms linear infinite;
  -webkit-animation: pulse 2000ms linear infinite;
  -moz-animation: pulse 2000ms linear infinite;
}

.load i{
  position:absolute;
  top:28px;
  left:24%;
  color:white;
  text-shadow:-1px -1px #333;
}

.load:after,
.load:before {
  display: inline-block;
  margin: auto;
  position: absolute;
  content: "";
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: #5cb8cd;
}

.load:after {
  z-index: -100;
  -webkit-animation: outer-ripple 2000ms linear infinite;
  -moz-animation: outer-ripple 2000ms linear infinite;
  animation: outer-ripple 2000ms linear infinite;
}

.load:before {
  z-index: -200;
  -webkit-animation: inner-ripple 2000ms linear infinite;
  -moz-animation: inner-ripple 2000ms linear infinite;
  animation: inner-ripple 2000ms linear infinite;
}
/* outer ripple */


@keyframes pulse{
  0% {
    transform: scale(0.8);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  10% {
    transform: scale(1.1);
    filter: alpha(opacity=1);
    opacity: 1;
  }
  20% {
    transform: scale(0.9);
    filter: alpha(opacity=1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
}

@-moz-keyframes pulse{
  0% {
    transform: scale(0.8);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  10% {
    transform: scale(1.1);
    filter: alpha(opacity=1);
    opacity: 1;
  }
  20% {
    transform: scale(0.9);
    filter: alpha(opacity=1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
}

@-webkit-keyframes pulse{
  0% {
    transform: scale(0.8);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  10% {
    transform: scale(1.1);
    filter: alpha(opacity=1);
    opacity: 1;
  }
  20% {
    transform: scale(0.9);
    filter: alpha(opacity=1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
}


@keyframes outer-ripple {
  0% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  80% {
    transform: scale(3.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
  100% {
    transform: scale(3.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
}

@-webkit-keyframes outer-ripple {
  0% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  80% {
    transform: scale(3.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
  100% {
    transform: scale(3.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
}

@-moz-keyframes outer-ripple {
  0% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  80% {
    transform: scale(3.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
  100% {
    transform: scale(3.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
}
/* inner ripple */

@keyframes inner-ripple {
  0% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  30% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
}

@-webkit-keyframes inner-ripple {
  0% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  30% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
}

@-moz-keyframes inner-ripple {
  0% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  30% {
    transform: scale(1);
    filter: alpha(opacity=50);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.5);
    filter: alpha(opacity=0);
    opacity: 0;
  }
}

@keyframes scan {
  to {
    transform: rotate(1turn);
  }
}

</style>