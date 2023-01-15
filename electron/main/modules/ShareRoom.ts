import axios from "axios";
import CONSTANTS from "../utils/constants";
import {ConfigModel, DeviceModel, ShareRoomModel} from "../../models";
import {
    findDevicesInNetwork,
    generateRandomColor,
    generateShortPasscode,
    generateUID,
    getHostIp
} from "../utils/utility";
import Store from "electron-store";

const settings = new Store();


export class ShareRoom {
    private _room: ShareRoomModel;

    constructor() {
        this._room = null;
    }

    isRoomActive(): boolean {
        return !!this._room
    }

    getRoom(): ShareRoomModel {
        return this._room;
    }

    async findRooms(): Promise<any[]> {
        // signal: 'SIGTERM',
        // Get all devices in network
        const devices = await findDevicesInNetwork();

        const rooms: any[] = [];
        // Get devices meta info by connecting to server
        for (const device of devices) {
            // console.log(`[connection]: http://${device.ip}:${CONSTANTS.PUBLIC_PORT}/share-room`)
            try {
                const room = await axios.get(`http://${device.ip}:${CONSTANTS.PUBLIC_PORT}/share-room`, {
                    timeout: 2500
                });
                rooms.push({...room.data.data, hostIp: device.ip});
            } catch (e) {
                console.log('[DEVICE_RESPONSE]', e.response)
            }
        }
        return rooms;
    }

    async createRoom(name: string, maxParticipants = null): Promise<ShareRoomModel> {
        // If rome already exist, return room
        if (this.isRoomActive()) return this._room;
        // else create new room
        const deviceInfo: DeviceModel = settings.get('deviceInfo') as DeviceModel;
        const config: ConfigModel = settings.get('config') as ConfigModel;
        this._room = {
            id: generateUID('rm', deviceInfo.id),
            name,
            files: [],
            color: generateRandomColor(),
            hostIp: getHostIp(),
            maxParticipants: maxParticipants || config.maxParticipants,
            deviceId: deviceInfo.id,
            passcode: generateShortPasscode(),
            participants: []
        }
        return this._room;
    }

    addToRoom(participant: DeviceModel) {
        if (!this.isRoomActive()) {
            throw new Error('[RM_INACTIVE] There is no active room')
        }
        // Add participant
        this._room.participants.push(participant);
    }

    removeParticipant(id: string) {
        this._room.participants = this._room.participants.filter(p => p.id !== id);
        return this._room.participants;
    }

    closeRoom() {
        this._room = null;
    }
}