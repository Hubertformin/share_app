<template>
  <div
      class="h-screen"
      :style="`background: linear-gradient(to bottom, ${activeShareRoom.color}, #1E1E1E, #1E1E1E, #1E1E1E, #1E1E1E)`"
  >
    <div
        id="header"
        class="flex px-6 items-center justify-between"

    >
      <div class="lead">
        <div class="room flex gap-2 items-center">
          <div class="icon">
            <v-icon name="md-settingsinputantenna-outlined" scale="2.2" fill="white" />
          </div>
          <div class="tile">
            <h2 class="text-lg text-white font-semibold mb-0">{{activeShareRoom.name}}'s room</h2>
            <p class="text-gray-300 mb-0">Passcode: <span class="font-bold underline">{{activeShareRoom.passcode}}</span></p>
          </div>
        </div>
      </div>
      <div class="trail flex gap-4">
        <a-button danger type="primary" shape="circle">
          <template #icon><v-icon name="bi-power" fill="white" /></template>
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
        swiper-color="#67b5fd"
        icon-color="#67b5fd"
        background-color="#1E1E1E"
        :options="options"
        v-model="selected">
      <template #icon="{ props }"><v-icon :name="props.icon" /></template>
    </SwipeBottomNavigation>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { SwipeBottomNavigation } from "bottom-navigation-vue";
import {SHARE_ROOM_EVENTS} from "../../models/socket-events";
import {mapMutations, mapState} from "vuex";
import {DOWNLOAD_STATE} from "../../models";
import {defineComponent} from "vue";
export default defineComponent({
  components: { SwipeBottomNavigation },
  data: () => ({
    selected: 1,
    $socket: {},
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
  mounted() {
    /**
     * A;; listener functions should be init here
     */
    this.initListeners()
  },
  computed: {
    ...mapState(['socket', 'activeShareRoom'])
  },
  methods: {
    ...mapMutations(['setSocket', 'addFilesToRoom', 'addDevicesToRoom']),
    initListeners() {
      // Listen to files in the room
      this.socket.on(SHARE_ROOM_EVENTS.ON_FILE_ADD, (files:  any[]) => {
        // Add download meta data
        files = files.map((file: any) => {
          file['downloadMeta'] = {
            state: DOWNLOAD_STATE.NOT_DOWNLOADED,
            totalBytes: 0,
            path: '',
            percent: 0,
            transferredBytes: 0
          }
          return file;
        });
        //Add to state...
        this.addFilesToRoom(files);
      });
      // Listen to devices in room
      this.socket.on(SHARE_ROOM_EVENTS.ON_DEVICES_CHANGE, (devices: string) => {
        // Add to state...
        this.addDevicesToRoom(JSON.parse(devices));
      })
    },
  }
});
</script>

<style scoped lang="scss">
  $header-height: 75px;
  #header {
    height: $header-height;
    // border-bottom: 1px solid #ddd;
    // background: linear-gradient(to bottom, #00488d, #00488d, rgba(0, 0, 0, 0));
  }
 #page_view {
   height: calc(100vh - ($header-height + 64px));
   overflow-y: auto;
 }
</style>
