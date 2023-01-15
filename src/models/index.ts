export interface FileDownloadMeta {
    state: string,
    percent: number,
    transferredBytes: number,
    canResume: boolean,
    totalBytes: number;
    path: string;
}
export interface FileModel {
    id: string;
    name: string;
    size: number;
    type: string;
    sharedDate: string;
    lastModifiedDate: string;
    device: {
        id: string;
        name: string;
        machineIp: string;
        path: string;
    }
    downloadMeta?: FileDownloadMeta
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
    color: string;
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

export const DOWNLOAD_STATE = {
    NOT_DOWNLOADED: 'NOT_DOWNLOADED',
    DOWNLOADED: 'DOWNLOADED',
    DOWNLOADING: 'DOWNLOADING',
    DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',
    DOWNLOAD_COMPLETE: 'DOWNLOAD_COMPLETE',
    DOWNLOAD_CANCELLED: 'DOWNLOAD_CANCELLED',
    DOWNLOAD_BUILDING: 'DOWNLOAD_BUILDING',
}