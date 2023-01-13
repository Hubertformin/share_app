import ShortUniqueId from "short-unique-id";
import find from "local-devices";
import {networkInterfaces} from "os";

const uid = new ShortUniqueId({length: 24});

const passcode = new ShortUniqueId({length: 6});

export function generateUID(prefix: string, suffix: string = ''): string {
    return `${prefix}_${uid()}_${suffix}`;
}

export function generateShortPasscode() {
    return passcode().toString().toUpperCase();
}

/**
 * The findDevicesInNetwork function finds all devices in the network and returns them.
 *
 * @return An array of objects with the following properties:
 *
 */
export async function findDevicesInNetwork() {
    const devices = await find();

    return devices.filter(d => d.ip != getHostIp());

}

/**
 * The getHostIp function returns the IP address of the host machine.
 *
 * @return The ip address of the host machine
 *
 * @docauthor Trelent
 */
export function getHostIp(): string {
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    const key = Object.keys(results)[0];
    return results[key][0];
}

export function generateRandomColor(): string {
    const COLORS = [
        "#BA000D",
        "#006978",
        "#E1980C",
        "#005B9F",
        "#673AB7",
        "#A00037",
        "#00766C",
        "#00600F",
        "#BC5100",
        "#283593",
        "#C41C00",
        "#29434e",
    ];
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
}