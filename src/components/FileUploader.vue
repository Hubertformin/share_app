<template>
  <div class="uploader">
    <div
        class="dropzone flex justify-center items-center"
        :class="{dragOver: isDragging}"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
        @click="openFilePicker"
    >
      <input
          type="file"
          multiple
          name="file"
          id="fileInput"
          class="hidden-input"
          @change="onChange"
          ref="file"
          accept="*"
          style="display: none;"
      />
      <v-icon name="bi-plus-square-dotted" scale="1.5" :fill="isDragging ? '#fff' :'#00488d'" />
      <h4 class="ml-2 text font-semibold mb-0">
        {{isDragging ? 'Drop Files here' : 'Click or Drop files here to send'}}
      </h4>
    </div>
  </div>
</template>

<script lang="ts">
import {SHARE_ROOM_EVENTS} from "../models/socket-events";
import {DeviceModel} from "../models";
import { fetchMain } from "../utils/ipc-render";
import { mapState } from "vuex";

export default {
  name: "FileUploader",
  data() {
    return {
      files: [],
      isDragging: false
    }
  },
  computed: {
    ...mapState(['socket'])
  },
  methods: {
    openFilePicker() {
      this.$refs.file.click();
    },
    onChange(e) {
      this.addFilesToRoom(e.target.files)
    },
    dragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e) {
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
}
</script>

<style scoped lang="scss">
$footer-height: 80px;
$dropzone-height: 65px;
.uploader {
  height: $footer-height;
  position: relative;
  // padding-top: calc($footer-height - $dropzone-height);

  .dropzone {
    height: $dropzone-height;
    border-radius: 12px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid #83bef8;
    background-color: #f6fcff;
    cursor: pointer;
    transition: all 0.4s linear;
    .text {
      color: #00488d;
    }
    &.dragOver {
      transform: scale(1.01);
      background-color: #2196f3;
      .text {
        color: white;
      }
    }

    &:hover {
      background-color: #e9eef5;
    }
  }
}
</style>