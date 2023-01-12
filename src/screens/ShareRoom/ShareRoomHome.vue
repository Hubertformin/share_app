<script lang="ts">
import { SwipeBottomNavigation } from "bottom-navigation-vue";
import {SHARE_ROOM_EVENTS} from "../../models/socket-events";
import {fetchMain} from "../../utils/ipc-render";
import {io, Socket} from "socket.io-client";
import {mapMutations} from "vuex";
import {DeviceModel, DOWNLOAD_STATE} from "../../models";
export default {
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
    fetchMain('create-room', {name: "Hub's room"})
        .then(async (data: any) => {
          console.log(data)
          const deviceInfo: DeviceModel = (this as any).$settings.get('deviceInfo') as DeviceModel;
          // Connect to socket
          const socket = io('ws://127.0.0.1:2391', {
            auth: {
              passcode: data.passcode
            },
            query: {
              device: JSON.stringify(deviceInfo)
            }
          });
          // update socket var in state
          this.setSocket(socket);

          this.initListeners(socket);
        })
        .catch(console.error);
  },
  methods: {
    ...mapMutations(['setSocket', 'addFilesToRoom', 'addDevicesToRoom']),
    initListeners(socket: Socket) {
      // Listen to files in the room
      socket.on(SHARE_ROOM_EVENTS.ON_FILE_ADD, (files) => {
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
      socket.on(SHARE_ROOM_EVENTS.ON_DEVICES_CHANGE, (devices) => {
        // Add to state...
        this.addDevicesToRoom(JSON.parse(devices));
      })
    },
  }
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
