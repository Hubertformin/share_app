<template>
  <div class="body h-screen w-full">
    <div v-if="shareRooms.length > 0" class="rooms-view h-screen h-full">
      <div class="header flex justify-center items-center">
        <h1 class="text-xl font-bold text-white">ShareRooms</h1>
      </div>
      <div class="body pt-16 pl-6 pr-8">
        <div class="room-card">
          <div class="flex justify-between pr-6">
            <div class="leading flex gap-4 items-center">
              <div class="room-icon flex items-center justify-center rounded-full bg-orange-500">
                <v-icon name="md-settingsinputantenna-outlined" scale="1.3" fill="white"/>
              </div>
              <div class="tile-card">
                <h2 class="title-card-title font-semibold mb-1">Hubert's ShareRoom</h2>
                <div class="flex gap-4">
                  <p class="text-slate-400 mb-0 text-sm">
                    <v-icon name="md-people-sharp" scale="0.9"/>&nbsp;2 People
                  </p>
                  <p class="text-slate-400 mb-0 text-sm">
                    <v-icon name="md-filecopy" scale="0.7"/>&nbsp;2 Files
                  </p>
                </div>
              </div>
            </div>
            <div class="actions">
              <a-button type="primary" :loading="false" @click="joinRoom()">Join</a-button>
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
        centered
        ok-text="Join"
        @ok="modalVisible = false"
    >
      <div class="pr-6 mb-10">
        <div class="leading flex gap-4 items-center">
          <div class="room-icon flex items-center justify-center rounded-full bg-orange-500">
            <v-icon name="md-settingsinputantenna-outlined" scale="1.3" fill="white"/>
          </div>
          <div class="tile-card">
            <h2 class="title-card-title font-semibold mb-1">Hubert's ShareRoom</h2>
            <div class="flex gap-4">
              <p class="text-slate-400 mb-0 text-sm">
                <v-icon name="md-people-sharp" scale="0.9"/>&nbsp;2 People
              </p>
              <p class="text-slate-400 mb-0 text-sm">
                <v-icon name="md-filecopy" scale="0.7"/>&nbsp;2 Files
              </p>
            </div>
          </div>
        </div>
      </div>
      <a-input autofocus placeholder="Enter passcode"/>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {mapState} from "vuex";
import {defineComponent} from "vue";
import RadarAnimation from '../components/RadarAnimation.vue';
import {fetchMain} from "../utils/ipc-render";

export default defineComponent({
  name: "JoinRoom",
  components: {RadarAnimation},
  data() {
    return {
      modalVisible: false,
      shareRooms: [],
      isFetchingRooms: true
    }
  },
  mounted() {
    this.loadRooms();
  },
  computed: {
    ...mapState(['activeShareRoom'])
  },
  methods: {
    loadRooms() {
      console.log('finding rooms');
      fetchMain<any[]>('find-rooms')
          .then((data) => {
            // Stop showning fetching animation if no rooms have been found
            this.isFetchingRooms = !(data.length === 0);
            this.shareRooms = data;
          })
    },
    onSearch() {
      this.isFetchingRooms = true;
      this.loadRooms();
    },
    joinRoom() {
      this.modalVisible = true;
      // $router.push('/share-room')
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