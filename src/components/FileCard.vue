<template>
  <div class="px-2 mt-2">
    <div class="flex items-center gap-2 mb-2">
      <h2 class="device-name font-bold mb-0">{{file.device.name}}</h2>
      <p class="mb-0 font-medium text-slate-400 text-sm">{{timeAgo(file.sharedDate)}}</p>
    </div>
    <div class="file-box cursor-p ml-2 rounded-lg px-4 flex items-center justify-between">
      <div class="leading flex gap-2.5">
        <span class="file_icon" :class="getFileIconClass(file.name)"></span>
        <div class="meta flex flex-col justify-center">
          <p class="file_name mb-0 font-bold">{{file.name}}</p>
          <div class="flex gap-2.5 items-center">
            <p v-if="file.downloadMeta.state === DOWNLOAD_STATE.DOWNLOADING" class="file_size_downloading text-slate-400 mb-0">
              {{readableFileSize(file.downloadMeta.transferredBytes, true)}} / {{readableFileSize(file.downloadMeta.totalBytes, true)}}
            </p>
            <p v-else class="file_size text-slate-400 mb-0">
              {{readableFileSize(file.size, true)}}
            </p>
          </div>
        </div>
      </div>
      <div class="actions pr-3">
<!--            v-if="file.device.id !== deviceInfo.id" -->
        <div class="flex gap-2" v-if="file.downloadMeta.state === DOWNLOAD_STATE.DOWNLOADING">
          <a-button
              v-if="file.downloadMeta.canResume"
              type="text" :loading="false"
          >
            <template #icon><v-icon name="pr-pause" scale="1.5"/></template>
          </a-button>
          <a-button
              type="text"
              :loading="false"
              @click="cancelDownload"
          >
            <template #icon><v-icon fill="#ff4d4f" name="bi-stop-fill" scale="1.5"/></template>
          </a-button>
        </div>
        <a-button
            v-else-if="file.downloadMeta.state === DOWNLOAD_STATE.NOT_DOWNLOADED"
            type="text" :loading="false"
            @click="download"
        >
          <template #icon><v-icon name="bi-download" scale="1.5"/></template>
        </a-button>
      </div>
      <div v-if="file.downloadMeta.state === DOWNLOAD_STATE.DOWNLOADING" class="progress-section">
        <a-progress
            strokeColor="#479cd7"
            :show-info="false"
            status="active"
            :percent="file.downloadMeta.percent * 100"
        />
      </div>
    </div>
    <a-divider />
  </div>
</template>

<script lang="ts">
import {getFileIconClass} from "../utils/file-icon";
import { DOWNLOAD_STATE, DeviceModel} from "../models";
import {timeAgo, readableFileSize} from "../utils/strings";
import {sendMain} from "../utils/ipc-render";
import {defineComponent} from "vue";
import {mapState} from "vuex";

export default defineComponent({
  props: ['file'],
  data() {
    return {
      DOWNLOAD_STATE,
      deviceInfo: (this as any).$settings.get('deviceInfo') as DeviceModel,
    }
  },
  computed: {
    ...mapState(['activeShareRoom'])
  },
  methods: {
    getFileIconClass,
    timeAgo,
    readableFileSize,
    download() {
      // download file to local computer
      sendMain('download-file', this.file)
    },
    cancelDownload() {
      console.log('cancel')
      sendMain('cancel-download', this.file)
    }
  },
})
</script>

<style lang="scss" scoped>
.device-name {
  color: #fa77bc;
}

.file-box {
  position: relative;
  overflow: hidden;
  border: 1px solid #626262;
  color: #479cd7;
  height: 70px;
}

.file_icon::before {
  display: inline-block;
  font-size: 28px;
}

.file_name {
  font-size: 16px;
}

*[class^="file_size"] {
  font-size: 13.5px;
  font-weight: 500;
}

.progress-section {
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
}
</style>