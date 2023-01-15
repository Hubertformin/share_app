<script lang="ts">
import {listenToMainEvents} from "./utils/ipc-render";
import {mapMutations, mapState} from "vuex";
import {DeviceModel, DOWNLOAD_STATE, ShareRoomModel} from "./models";
import {defineComponent} from "vue";
import {io, Socket} from "socket.io-client";
import {notification} from "ant-design-vue";
import {SHARE_ROOM_EVENTS} from "./models/socket-events";

export default defineComponent({
  name: 'App',
  data() {
  },
  computed: {
    ...mapState(['activeShareRoom'])
  },
  mounted() {
    // listen to download events and update state
    this.listenToDownloadEvents();
    // @ts-ignore
    this.$emitter.on('init-sockets', ({passcode, route}) => {
      this.initSockets(passcode, route);
    })

  },
  methods: {
    ...mapMutations([
        'updateFileDownloadData',
        'updateTotalDownloadData',
        'addFilesToRoom',
        'addDevicesToRoom',
        'setSocket',
        'clearRoomData'
    ]),
    /**
     * Initialize socket
     */
    initSockets(passcode: string, route = true) {
      const deviceInfo: DeviceModel = (this as any).$settings.get('deviceInfo') as DeviceModel;
      // Connect to socket
      const url = `ws://${(this.activeShareRoom as ShareRoomModel).hostIp}:2391`;
      const socket = io(url, {
        auth: {
          passcode
        },
        query: {
          device: JSON.stringify(deviceInfo)
        }
      });

      socket.connect();

      // when connection is established head to room
      socket.on('connect', () => {
        // got to share room home page
        if (route) this.$router.push('/share-room');
      });

      socket.on('connect_error', (e) => {
        console.log(e)
        // this.$router.push('/').then(() => this.clearRoomData())
        notification.warn({
          message: `Unable to connect to ${this.activeShareRoom.name}`,
          description: `
          Unable to connect to ${this.activeShareRoom.name}'s room. Try again. If problem persist, restart application.
          `
        })
      });

      socket.on('disconnect', (e) => {
        this.$router.push('/').then(() => this.clearRoomData())
        notification.info({
          message: `${this.activeShareRoom.name}'s room was terminated`,
          description: `
          ${this.activeShareRoom.name}'s was terminated by owner, You can connect to another room.
          `
        })
      });
      // Listen to files in the room
      socket.on(SHARE_ROOM_EVENTS.ON_FILE_ADD, (files:  any[]) => {
        // Add download meta data
        files = files.map((file: any) => {
          file['downloadMeta'] = {
            canResume: false,
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
      socket.on(SHARE_ROOM_EVENTS.ON_DEVICES_CHANGE, (devices: string) => {
        // Add to state...
        this.addDevicesToRoom(JSON.parse(devices));
      });
      // Set socket for other components
      this.setSocket(socket);
    },
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
            totalBytes: 0,
            speed: 0
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
            totalBytes: data.totalBytes,
            speed: data.speed
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

      listenToMainEvents('file-download-building', (data) => {
        // @ts-ignore
        this.updateFileDownloadData({
          id: data.fileId,
          data: {
            state: DOWNLOAD_STATE.DOWNLOAD_BUILDING,
            percent: data.percent,
            transferredBytes: 0,
            totalBytes: 0,
            speed: data.speed
          }
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
});
</script>

<template>
  <router-view></router-view>
</template>
