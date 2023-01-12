<script lang="ts">
import {listenToMainEvents} from "./utils/ipc-render";
import {mapMutations} from "vuex";
import {DOWNLOAD_STATE} from "./models";

export default {
  name: 'App',
  mounted() {
    // listen to download events and update state
    this.listenToDownloadEvents();

  },
  methods: {
    ...mapMutations(['updateFileDownloadData', 'updateTotalDownloadData']),
    listenToDownloadEvents() {
      listenToMainEvents('file-download-started', (data) => {
        // @ts-ignore
        this.updateFileDownloadData({
          id: data.fileId,
          data: {
            state: DOWNLOAD_STATE.DOWNLOADING,
            percent: 0,
            transferredBytes: 0,
            canResume: data.canResume,
            totalBytes: 0
          }
        });
      });

      listenToMainEvents('file-download-progress', (data) => {
        // @ts-ignore
        this.updateFileDownloadData({
          id: data.fileId,
          data: {
            state: DOWNLOAD_STATE.DOWNLOADING,
            percent: data.percent,
            transferredBytes: data.transferredBytes,
            totalBytes: data.totalBytes
          }
        });
      });

      listenToMainEvents('total-download-progress', (data) => {
        // @ts-ignore
        this.updateTotalDownloadData({
          percent: data.percent,
          transferredBytes: data.transferredBytes,
          totalBytes: data.totalBytes
        });
      });

      listenToMainEvents('file-download-complete', (data) => {
        // @ts-ignore
        this.updateFileDownloadData({
          id: data.fileId,
          data: {
            state: DOWNLOAD_STATE.DOWNLOAD_COMPLETE,
            path: data.path
          }
        });
      });

      listenToMainEvents('file-download-canceled', (data) => {
        // @ts-ignore
        this.updateFileDownloadData({
          id: data.fileId,
          data: {
            state: DOWNLOAD_STATE.NOT_DOWNLOADED,
            percent: 0,
            transferredBytes: 0,
            totalBytes: 0
          }
        });
      });
    }
  }
}
</script>

<template>
  <router-view></router-view>
</template>
