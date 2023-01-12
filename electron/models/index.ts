
export interface FileModel {
    id: string;
    name: string;
    size: number;
    type: string;
    sharedDate: string;
    lastModifiedDate: string;
    device: {
        id: string;
        machineIp: string;
        path: string;
    }
}


export interface DeviceModel {
    id: string;
    name: string;
    platform: string;
    ip?: string;
    joinedOn?: string;
}

export interface ShareRoomModel {
    id: string;
    name: string;
    participants: DeviceModel[]
    deviceId: string;
    maxParticipants: number;
    passcode: string;
    files: FileModel[];
    hostIp: string;
}

export interface ConfigModel {
    maxParticipants: number;
    destinationDir: string;
    autoDownloadInRoom: boolean;
}