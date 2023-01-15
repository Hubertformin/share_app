import {app} from 'electron'
import os from "os";
import platform from 'systeminformation';
import Store from 'electron-store';

export async function initApp(settings: Store) {
    // check for user data if not set is user data does not exist
    const deviceInfo = settings.get('deviceInfo');
    const config = settings.get('config');
    const osName = await platform.osInfo();

    if (!deviceInfo) {
        // set user
        const userInfo = os.userInfo();
        settings.set('deviceInfo', {
            id: `${userInfo.uid}_${userInfo.username}`,
            name: osName.hostname || userInfo.username,
            platform: osName.codename || osName.distro,
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
