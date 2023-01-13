<template>
  <div class="page h-full px-4 pb-3">
    <div class="header flex items-center justify-between">
      <h1 class="text-lg mb-0 font-bold">Transfer Hub</h1>
      <div class="action">
<!--        <p class="text-slate-400">Hubert, Mark are adding files to room..</p>-->
<!--        <a-progress type="circle" :percent="30" :show-info="false" :width="25" />-->
      </div>
    </div>
    <div
        class="body rounded-xl pt-3 px-2 border pb-6"
        :class="{dragOver: isDragging}"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
    >
      <FileCard v-for="(file, index) in roomFiles" :file="file"/>
      <!--    empty state-->
      <div v-if="roomFiles.length < 1" class="h-full flex items-center px-24">
        <a-empty>
          <template #description>
            <h3 class="text-xl font-bold">No files in this room</h3>
            <p class="text-slate-500">Drop files here to share. <br> When files get shared, they will appear here and will be visiable to everyone in
              this room</p>
          </template>
        </a-empty>
      </div>
    </div>
    <div class="foot">
      <FileUploader/>
    </div>
  </div>
</template>

<script lang="ts">
import FileCard from "../../components/FileCard.vue";
import FileUploader from "../../components/FileUploader.vue";
import {mapState} from "vuex";
import {DeviceModel} from "../../models";
import {fetchMain} from "../../utils/ipc-render";
import {SHARE_ROOM_EVENTS} from "../../models/socket-events";
import {defineComponent} from "vue";

export default defineComponent({
  name: "TransferHub",
  components: {FileCard, FileUploader},
  data() {
    return {
      isDragging: false
    }
  },
  computed: {
    ...mapState(['roomFiles', 'socket'])
  },
  methods: {
    dragover(e: any) {
      e.preventDefault();
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e: any) {
      e.preventDefault();

      this.isDragging = false;

      this.addFilesToRoom(e.dataTransfer.files);
    },
    async addFilesToRoom(payload: any[]) {
      // Converting to array, so I can use .map, FileList
      const _files = [...payload].reverse();
      const deviceInfo: DeviceModel = (this as any).$settings.get('deviceInfo') as DeviceModel;
      // get machine ip
      const machineIp = await fetchMain<string>('get-ip');
      // structure files
      const files = _files.map((file: any) => {
        return {
          name: file.name,
          lastModifiedDate: file.lastModifiedDate.toISOString(),
          device: {
            id: deviceInfo.id,
            name: deviceInfo.name,
            path: file.path,
            machineIp
          },
          size: file.size,
          type: file.type,
        }
      });

      (this as any).socket.emit(SHARE_ROOM_EVENTS.ON_FILE_ADD, JSON.stringify({files}))
    }
  }
})
</script>

<style scoped lang="scss">
$header-height: 50px;
$footer-height: 80px;
$dropzone-height: 65px;
.page {

}
.header {
  height: $header-height;
}

.body {
  height: calc(100% - ($header-height + $footer-height));
  overflow-y: auto;
  transition: all 0.4s ease;
  background-color: #26272a;
  &.dragOver {
    transform: scale(1.008);
    border: 1px dashed #2196f3;
    background-color: #10293d;
  }
}

.foot {
  height: $footer-height;
}
</style>