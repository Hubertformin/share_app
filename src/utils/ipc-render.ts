import {ipcRenderer} from "electron";

declare type MAIN_EVENTS =
    'get-ip' | 'find-rooms' | 'create-room' |
    'close-room' |
    'file-download-progress' | 'file-download-started' |
     'file-download-complete' | 'total-download-progress' | 'file-download-building' |
    'file-download-canceled' | 'download-file' | 'cancel-download' |
    'open-file' | 'open-destination-folder' | 'select-dir'
export function fetchMain<T>(evt: MAIN_EVENTS, data: any = null): Promise<T> {
    return ipcRenderer.invoke(evt, JSON.stringify(data))
}

export function sendMain<T>(evt: MAIN_EVENTS, data: any = null) {
    ipcRenderer.send(evt, JSON.stringify(data))
}

interface MainArg {
    fileId: string;
    totalBytes?: number;
    percent?: number;
    transferredBytes?: number;
    canResume?: boolean;
    path?: string;
    speed: number;
}
export function listenToMainEvents(event: MAIN_EVENTS, handler: (arg: MainArg) => void) {
    ipcRenderer.on(event,  (arg, msg) => {
        handler(JSON.parse(msg))
    })
}