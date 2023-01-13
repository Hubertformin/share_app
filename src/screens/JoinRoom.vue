<template>
  <div class="body h-screen w-full">
    <RadarAnimation v-if="false" />
    <div class="rooms-view h-screen h-full">
      <div class="header flex justify-center items-center">
        <h1 class="text-xl font-bold text-white">ShareRooms</h1>
      </div>
      <div class="body pt-16 px-6">
        <div class="room-card flex justify-between">
          <div class="leading flex gap-2 items-center">
            <div class="room-icon flex items-center justify-center rounded-full bg-orange-500">
              <v-icon name="md-settingsinputantenna-outlined" scale="1.3" fill="white" />
            </div>
            <div class="tile-card">
              <h2 class="title font-semibold mb-0">Hubert's ShareRoom</h2>
              <p class="text-slate-500 mb-0 text-sm">2 participants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {mapState} from "vuex";
import {defineComponent} from "vue";
import RadarAnimation from '../components/RadarAnimation.vue';

export default defineComponent({
  name: "JoinRoom",
  components: {RadarAnimation},
  computed: {
    ...mapState(['activeShareRoom'])
  }
})
</script>

<style scoped lang="scss">
$room-header-height: 75px;
$body-border-radius: 55px;
.rooms-view {
  background-color: #00488d;
  .header {
    height: $room-header-height;
    background-color: transparent;
  }
  .body {
    height: calc(100% - $room-header-height);
    overflow-y: auto;
    background-color: white;
    border-top-left-radius: $body-border-radius;
    border-top-right-radius: $body-border-radius;
  }
}

.room-card {
  .title-card {
    .title {
      font-size: 25px;
    }
  }
}

.room-icon {
  $room-size: 50px;
  height: $room-size;
  width: $room-size;
}

</style>