<template>
  <div class="px-2 border-b pb-6 border-gray-200 mt-2 mb-6">
    <div class="flex items-center gap-2 mb-1">
      <h2 class="device-name font-bold text-teal-900 mb-0">{{file.device.name}}</h2>
      <p class="mb-0 font-medium text-slate-500 text-sm">{{timeAgo(file.sharedDate)}}</p>
    </div>
    <div class="file-box cursor-p ml-2 rounded-lg px-4 flex items-center justify-between">
      <div class="leading flex gap-2.5">
        <span class="file_icon" :class="getFileIconClass(file.name)"></span>
        <div class="meta flex flex-col justify-center">
          <p class="file_name mb-0 font-bold">{{file.name}}</p>
          <div class="flex gap-2.5 items-center">
            <p v-if="file.downloadMeta.state === DOWNLOAD_STATE.DOWNLOADING" class="text-slate-500 mb-0 font-medium text-sm">
              {{readableFileSize(file.downloadMeta.transferredBytes, true)}} / {{readableFileSize(file.downloadMeta.totalBytes, true)}}
            </p>
            <p v-else class="text-slate-500 mb-0 font-semibold text-sm">
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
            strokeColor="#2196f3"
            :show-info="false"
            :percent="file.downloadMeta.percent * 100"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {getFileIconClass} from "../utils/file-icon";
import { DOWNLOAD_STATE, DeviceModel} from "../models";
import {timeAgo, readableFileSize} from "../utils/strings";
import {sendMain} from "../utils/ipc-render";

export default {
  props: ['file'],
  data() {
    return {
      DOWNLOAD_STATE,
      deviceInfo: (this as any).$settings.get('deviceInfo') as DeviceModel,
    }
  },
  computed: {},
  methods: {
    getFileIconClass,
    timeAgo,
    readableFileSize,
    download() {
      // download file to local computer
      const url = `http://${this.file.device.machineIp}:2391/download?path=${this.file.device.path}&type=${this.file.type}`
      sendMain('download-file', {url, ...this.file})
    },
    cancelDownload() {
      console.log('cancel')
      sendMain('cancel-download', this.file)
    }
  },
}
</script>

<style lang="scss" scoped>
.file-box {
  position: relative;
  overflow: hidden;
  border: 1px solid #dddddd;
  height: 70px;
}

.file_icon::before {
  display: inline-block;
  font-size: 28px;
}

.progress-section {
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
}
</style>