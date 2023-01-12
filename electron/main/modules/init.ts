import {app} from 'electron'
import Store from 'electron-store';
import os from "os";
import platform from 'systeminformation';

Store.initRenderer();
const settings = new Store();

export async function initApp() {
    // check for user data if not set if user data does not exist
    const deviceInfo = settings.get('deviceInfo');
    const config = settings.get('config');
    const osName = await platform.osInfo();

    if (!deviceInfo) {
        // set user
        const userInfo = os.userInfo();
        settings.set('deviceInfo', {
            id: `${userInfo.uid}_${userInfo.username}`,
            name: userInfo.username,
            platform: osName.codename,
        })
    }

    if (!config) {
        settings.set('config', {
            maxParticipants: 20,
            destinationDir: app.getPath('downloads'),
            autoDownloadInRoom: true
        })
    }
}
