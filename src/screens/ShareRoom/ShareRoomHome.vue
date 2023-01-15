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
            <v-icon name="md-settingsinputantenna-outlined" scale="2.2" fill="white"/>
          </div>
          <div class="tile">
            <h2 class="text-lg text-white font-semibold mb-0">{{ activeShareRoom.name }}'s room</h2>
            <p class="text-gray-300 mb-0">Passcode: <span
                class="font-bold underline">{{ activeShareRoom.passcode }}</span></p>
          </div>
        </div>
      </div>
      <div class="trail flex gap-4">
        <template v-if="activeShareRoom.deviceId === deviceInfo.id">
          <a-button danger type="primary" shape="round" @click="closeRoom">
            <template #icon>
              <v-icon name="bi-power" fill="white"/>
            </template>
            Close
          </a-button>
<!--          <a-button  ghost shape="circle">-->
<!--            <template #icon>-->
<!--              <v-icon name="co-settings" fill="blue"/>-->
<!--            </template>-->
<!--          </a-button>-->
        </template>
        <template v-else>
          <a-button danger type="primary" shape="round" @click="leaveRoom()">
            <template #icon>
              <v-icon name="ri-logout-circle-r-line" fill="white"/>
            </template>
            Leave
          </a-button>
        </template>
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
      <template #icon="{ props }">
        <v-icon :name="props.icon"/>
      </template>
    </SwipeBottomNavigation>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {SwipeBottomNavigation} from "bottom-navigation-vue";
import {SHARE_ROOM_EVENTS} from "../../models/socket-events";
import {mapMutations, mapState} from "vuex";
import {DeviceModel, DOWNLOAD_STATE} from "../../models";
import {defineComponent} from "vue";
import {Modal} from "ant-design-vue";
import {fetchMain, sendMain} from "../../utils/ipc-render";

export default defineComponent({
  components: {SwipeBottomNavigation},
  data() {
    const deviceInfo: DeviceModel = (this as any).$settings.get('deviceInfo') as DeviceModel;
    return {
      selected: 1,
      deviceInfo,
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
    }
  },
  mounted() {
  },
  computed: {
    ...mapState(['socket', 'activeShareRoom'])
  },
  methods: {
    ...mapMutations(['setSocket', 'addFilesToRoom', 'addDevicesToRoom']),
    closeRoom() {
      Modal.confirm({
        title: 'Are you sure you want to close this room?',
        content: 'Closing this room will disconnect all connected devices and terminate all current downloads',
        okText: 'Close',
        cancelText: 'Cancel',
        onOk: () => {
          fetchMain('close-room').then(() => this.$router.push('/'))
        }
      });
    },
    leaveRoom() {
      Modal.confirm({
        title: 'Are you sure you want to leave this room?',
        content: 'Leaving this room will terminate all current downloads',
        okText: 'Close',
        cancelText: 'Cancel',
        onOk: () => {
          sendMain('cancel-all-downloads');
          this.socket.disconnect();
          this.$router.push('/')
        }
      });
    }
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
