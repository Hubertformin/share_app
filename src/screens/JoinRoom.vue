<template>
  <div class="body h-screen w-full">
    <div v-if="shareRooms.length > 0" class="rooms-view h-screen h-full">
      <div class="header flex justify-center items-center">
        <h1 class="text-xl font-bold text-white">ShareRooms</h1>
      </div>
      <div class="body pt-16 pl-6 pr-8">
        <div v-for="(room, index) in shareRooms" class="room-card">
          <div class="flex justify-between pr-6">
            <div class="leading flex gap-4 items-center">
              <div
                  class="room-icon flex items-center justify-center rounded-full"
                  :style="`background-color:${room.color} `"
              >
                <v-icon name="md-settingsinputantenna-outlined" scale="1.3" fill="white"/>
              </div>
              <div class="tile-card">
                <h2 class="title-card-title font-semibold mb-1">{{room.name}}</h2>
                <div class="flex gap-4">
                  <p class="text-slate-400 mb-0 text-sm">
                    <v-icon name="md-people-sharp" scale="0.9"/>&nbsp;{{room.participants.length}} People
                  </p>
                  <p class="text-slate-400 mb-0 text-sm">
                    <v-icon name="md-filecopy" scale="0.7"/>&nbsp;{{room.files.length}} Files
                  </p>
                </div>
              </div>
            </div>
            <div class="actions">
              <a-button type="primary" :loading="false" @click="openJoinRoomModal(room)">Join</a-button>
            </div>
          </div>
          <a-divider/>
        </div>
      </div>
    </div>
    <RadarAnimation v-else :is-loading="isFetchingRooms" @onSearch="onSearch" />

    <a-modal
        v-model:visible="modalVisible"
        title="Join Room"
        width="450px"
        :closable="false"
        centered
    >
      <div class="pr-6 mb-10">
        <div class="leading flex gap-4 items-center">
          <div class="room-icon flex items-center justify-center rounded-full"
               :style="`background-color:${selectedRoom.color} `">
            <v-icon name="md-settingsinputantenna-outlined" scale="1.3" fill="white"/>
          </div>
          <div class="tile-card">
            <h2 class="title-card-title font-semibold mb-1">{{selectedRoom.name}}</h2>
            <div class="flex gap-4">
              <p class="text-slate-400 mb-0 text-sm">
                <v-icon name="md-people-sharp" scale="0.9"/>&nbsp;{{selectedRoom.participants.length}} People
              </p>
              <p class="text-slate-400 mb-0 text-sm">
                <v-icon name="md-filecopy" scale="0.7"/>&nbsp;{{selectedRoom.files.length}} Files
              </p>
            </div>
          </div>
        </div>
      </div>
      <a-input v-model:value="selectedRoomPasscode" placeholder="Enter passcode"/>
<!--      <template v-if="isPageLoading">-->
<!--        <div class="pt-6 flex justify-center align-center">-->
<!--          <v-icon name="pr-spinner" animation="spin" scale="2.0" />-->
<!--        </div>-->
<!--      </template>-->
      <template #footer>
        <a-button :disabled="isPageLoading" key="back" @click="modalVisible = false">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="isPageLoading" @click="joinRoom()">
          {{isPageLoading ? 'Joining..' : 'Join room'}}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {mapMutations, mapState} from "vuex";
import {defineComponent, ref} from "vue";
import RadarAnimation from '../components/RadarAnimation.vue';
import {fetchMain} from "../utils/ipc-render";
import {DeviceModel, ShareRoomModel} from "../models";
import {message, notification} from "ant-design-vue";
import {io} from "socket.io-client";

export default defineComponent({
  name: "JoinRoom",
  components: {RadarAnimation},
  data() {
    const rooms: ShareRoomModel[] = [];
    const selectedRoomPasscode = ref<string>('');
    return {
      modalVisible: false,
      shareRooms: rooms,
      selectedRoom: {},
      isFetchingRooms: true,
      isPageLoading: false,
      selectedRoomPasscode
    }
  },
  mounted() {
    if (this.shareRooms.length === 0) {
      this.loadRooms();
    }
  },
  computed: {
    ...mapState(['activeShareRoom'])
  },
  methods: {
    ...mapMutations(['setSocket', "setActiveShareRoom"]),
    loadRooms() {
      console.log('finding rooms');
      fetchMain<ShareRoomModel[]>('find-rooms')
          .then((data) => {
            // Stop showning fetching animation if no rooms have been found
            console.log(data)
            this.isFetchingRooms = data.length > 0;
            this.shareRooms = data;
          })
          .catch((err) => {
            console.log(err);
            this.isFetchingRooms = false;
            notification.warn({
              message: 'Unable to find rooms',
              description: 'There was a problem searching rooms. Please restart application'
            })
          })
    },
    onSearch() {
      this.isFetchingRooms = true;
      this.loadRooms();
    },
    openJoinRoomModal(room: ShareRoomModel) {
      this.selectedRoom = room;
      this.modalVisible = true;
      // $router.push('/share-room')
    },
    joinRoom() {
      if (!this.selectedRoom) return;

      if (this.selectedRoomPasscode === '') {
        message.warn('Please enter room passcode');
        return;
      }

      this.isPageLoading = true;

      this.setActiveShareRoom(this.selectedRoom);

      // @ts-ignore
      this.$emitter.emit('init-sockets', {passcode: this.selectedRoomPasscode, route: true});
    }
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
    background-color: #1e1e1e;
    border-top-left-radius: $body-border-radius;
    border-top-right-radius: $body-border-radius;
  }
}

.title-card-title {
  font-size: 16px;
}

.room-icon {
  $room-size: 50px;
  height: $room-size;
  width: $room-size;
}

</style>