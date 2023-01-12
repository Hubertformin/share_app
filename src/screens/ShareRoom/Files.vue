<template>
  <div class="h-full px-4 pb-3 bg-gray-100">
    <div class="header flex items-center justify-between">
      <div class="flex items-center gap-1">
        <h1 class="text-lg mb-0 font-bold">Saved Files</h1>
      </div>
      <div class="action">
        <a-button :loading="false" @click="openDestinationFolder">
          Open Folder
        </a-button>
      </div>
    </div>
    <div class="body bg-white rounded-xl pt-6 px-3 pr-6 border pb-6 pt-4">
      <div v-for="(file, index) in files"
           class="file-box cursor-pointer cursor-p ml-2 mb-5 rounded-lg px-4 flex items-center justify-between"
           @dblclick="openFile(file.downloadMeta?.path)"
      >
        <div class="leading flex gap-2.5">
          <span :class="`${getFileIconClass(file.name)} file_icon`"></span>
          <div class="meta flex flex-col justify-center">
            <p class="file_name mb-0 font-bold">{{file.name}}</p>
            <div class="flex gap-2.5 items-center">
              <p class="text-slate-500 mb-0 font-semibold text-sm">{{readableFileSize(file.size)}}</p>
            </div>
          </div>
        </div>
<!--        <div class="actions pr-3">-->
<!--          <a-button :loading="false">-->
<!--            Open Folder-->
<!--          </a-button>-->
<!--        </div>-->
      </div>

      <div v-if="files.length < 1" class="h-full flex items-center justify-center px-24">
        <a-empty>
          <template #description>
            <h3 class="text-xl font-bold">No downloaded files</h3>
            <p class="text-slate-500"></p>
          </template>
        </a-empty>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {getFileIconClass} from "../../utils/file-icon";
import {mapState} from "vuex";
import {DOWNLOAD_STATE} from "../../models";
import {readableFileSize} from "../../utils/strings";
import {sendMain} from "../../utils/ipc-render";

export default {
  name: "Files",
  data() {
    return {
      className: '',
    }
  },
  computed: {
    ...mapState({
       files: (state: any) => state.roomFiles.filter(f => f.downloadMeta?.state === DOWNLOAD_STATE.DOWNLOAD_COMPLETE)
    })
  },
  methods: {
    readableFileSize,
    getFileIconClass,
    openDestinationFolder() {
      sendMain('open-destination-folder', null)
    },
    openFile(path: string) {
      console.log(path)
      if (!path) return;
      sendMain('open-file', path)
    }
  },
}
</script>

<style scoped lang="scss">
$header-height: 50px;
.header {
  height: $header-height;
}
.body {
  height: calc(100% - $header-height);
  overflow-y: auto;
}
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
</style>