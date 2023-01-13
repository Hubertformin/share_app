// @ts-ignore
import * as fileIcons from "file-icons-js";
export function getFileIconClass(path: string) {
    return fileIcons.getClassWithColor(path);
}