<script lang="ts">
import { SwipeBottomNavigation } from "bottom-navigation-vue";
export default {
  components: { SwipeBottomNavigation },
  data: () => ({
    selected: 1,
    options: [
      {
        id: 1,
        title: 'Room',
        path: '/share-room',
        icon: 'md-settingsinputantenna-outlined',
        badge: 5,
        color: '#00488d'
      },
      {
        id: 2,
        title: 'People',
        path: '/share-room/people',
        icon: 'bi-people',
        color: '#3823f1'
      },
      {
        id: 3,
        title: 'Files',
        path: '/share-room/files',
        icon: 'bi-folder',
        color: '#d97816'
      },
    ]
  }),
};
</script>

<template>
  <div id="header" class="flex px-6 items-center justify-between">
    <div class="lead">
      <div class="room flex gap-2 items-center">
        <div class="icon">
          <v-icon name="md-settingsinputantenna-outlined" scale="2.2" fill="white" />
        </div>
        <div class="tile">
          <h2 class="text-lg text-white font-semibold mb-0">Hubert's ShareRoom</h2>
          <p class="text-gray-300 mb-0">Passcode: AX67P4</p>
        </div>
      </div>
    </div>
    <div class="trail flex gap-4">
      <a-button danger type="primary" shape="circle">
        <template #icon><v-icon name="io-power-outline" fill="white" /></template>
      </a-button>
      <a-button ghost shape="circle">
        <template #icon><v-icon name="co-settings" fill="blue" /></template>
      </a-button>
    </div>
  </div>
  <div id="page_view">
    <router-view></router-view>
  </div>
  <SwipeBottomNavigation
      swiper-color='#00488d'
      title-color="#00488d"
      icon-color="#00488d"
      :options="options"
      v-model="selected">
    <template #icon="{ props }"><v-icon :name="props.icon" /></template>
  </SwipeBottomNavigation>
</template>

<style scoped lang="scss">
  $header-height: 75px;
  #header {
    height: $header-height;
    border-bottom: 1px solid #ddd;
    background-color: #00488d;
  }
 #page_view {
   height: calc(100vh - ($header-height + 64px));
   overflow-y: auto;
 }
</style>
