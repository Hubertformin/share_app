import { createApp } from 'vue'
import { createStore } from 'vuex'
import {DeviceModel, FileDownloadMeta, FileModel, ShareRoomModel} from "../models";
import {Socket} from "socket.io-client";

interface StoreData {
    activeShareRoom: ShareRoomModel | any,
    roomFiles: FileModel[],
    socket: Socket | any,
    roomDevices: DeviceModel[],
    totalDownloads: {
        totalBytes?: number;
        percent?: number;
        transferredBytes?: number;
    }
}
// Create a new store instance.
const store = createStore({
    state (): StoreData {
        return {
            activeShareRoom: null,
            roomFiles: [],
            roomDevices: [],
            socket: null,
            totalDownloads: {
                percent: 0,
                transferredBytes: 0,
                totalBytes: 0
            }
        }
    },
    mutations: {
        addFilesToRoom(state, payload: FileModel[]) {
            state.roomFiles.unshift(...payload)
        },
        updateFileInRoom(state, payload: {id: string, data: FileModel}) {
            const files = state.roomFiles.map(file => {

                if (file.id === payload.id) {
                    Object.assign(file, payload.data)
                }

                return file;
            });
            state.roomFiles = files;

        },
        updateFileDownloadData(state, payload: {id: string, data: FileDownloadMeta}) {
            state.roomFiles = state.roomFiles.map(file => {

                if (file.id === payload.id) {
                    // @ts-ignore
                    Object.assign(file.downloadMeta, payload.data)
                }
                return file;
            });

        },
        updateTotalDownloadData(state, payload) {
            Object.assign(state.totalDownloads, payload)
        },
        addDevicesToRoom(state, payload: DeviceModel[]) {
            state.roomDevices.unshift(...payload)
        },
        setSocket(state, payload) {
            state.socket = payload;
        }
    }
});

export default store;