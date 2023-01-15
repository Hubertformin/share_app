import {app} from 'electron'
import os from "os";
import platform from 'systeminformation';
import Store from 'electron-store';
import { existsSync, mkdirSync } from 'fs';
import {join} from "node:path";

export async function initApp(settings: Store) {
    // check for user data if not set is user data does not exist
    const deviceInfo = settings.get('deviceInfo');
    const config = settings.get('config');
    const osName = await platform.osInfo();

    // Check and create default download path
    const DOWNLOADS_PATH = app.getPath('downloads');
    const DEFAULT_PATH = join(DOWNLOADS_PATH, 'ShareRoom');

    if (!existsSync(DEFAULT_PATH)) {
        mkdirSync(DEFAULT_PATH);
    }

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
            destinationDir: DEFAULT_PATH,
            autoDownloadInRoom: true
        })
    }
}
