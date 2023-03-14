import { ConfigModel, DeviceModel, FileModel } from "../../models";
import { BrowserWindow, ipcMain } from "electron";
import EasyDl from "easydl";
import Store from "electron-store";
import { clean } from "easydl/dist/utils";
import { join } from "node:path";

const settings = new Store();

interface FileDownload extends FileModel {
  downloadItemHandler: EasyDl;
  url: string;
  isResume: boolean;
  parallel: boolean;
  savedFilePath;
}

interface DownloadMangerOptions {
  maxDownloadInstances: number;
}

export class DownloadManager {
  private _downloadQueue: FileDownload[];
  private readonly _browserWindow: BrowserWindow;
  private _settings: Store;

  constructor(window: BrowserWindow, options: DownloadMangerOptions) {
    this._downloadQueue = [];
    this._browserWindow = window;
    this._settings = new Store();
  }

  getDownloadQueue() {
    return this._downloadQueue;
  }

  listenToDownloadEvents() {
    ipcMain.on("download-file", async (event, arg) => {
      const file = JSON.parse(arg) as FileDownload;
      // url
      this.addDownloadToQueue(file, true);
    });

    ipcMain.on("cancel-download", async (event, arg) => {
      const _file = JSON.parse(arg) as FileModel;
      this.cancelDownload(_file.id).catch(console.error);
    });

    ipcMain.on("cancel-all-downloads", async (event, arg) => {
      this.cancelAllDownloads().catch(console.error);
    });
  }

  addDownloadToQueue(file: FileDownload, start = true) {
    const config: ConfigModel = settings.get("config") as ConfigModel;

    const url = `http://${file.device.machineIp}:2391/download?path=${file.device.path}&type=${file.type}`;

    /**
     * downloaded will be true if .on('end') is fired
     * If the download is complete (not cancelled), the .on(end) event will be fired before .on(close)
     * The download var is used to track if the .on(close) is a cancellation or an download complet.
     */
    let downloaded = false;

    const dl = new EasyDl(url, join(config.destinationDir, file.name), {
      existBehavior: "overwrite",
      connections: 10,
      maxRetry: 5,
    })
      .on("metadata", (metadata) => {
        // do something with the metadata
        file.isResume = metadata.isResume;
        file.parallel = metadata.parallel;
        file.savedFilePath = metadata.savedFilePath;

        this._browserWindow.webContents.send(
          "file-download-started",
          JSON.stringify({
            fileId: file.id,
            canResume: metadata.isResume,
            parallel: metadata.parallel,
          })
        );
      })
      .on("progress", ({ details, total }) => {
        this._browserWindow.webContents.send(
          "file-download-progress",
          JSON.stringify({
            fileId: file.id,
            percent: total.percentage,
            transferredBytes: total.bytes,
            totalBytes: file.size,
            speed: total.speed,
            chunks: details.map((d) => {
              return {
                percent: d.percentage,
                transferredBytes: d.bytes,
                speed: d.speed,
              };
            }),
          })
        );
      })
      .on("end", () => {
        downloaded = true;
        this._browserWindow.webContents.send(
          "file-download-complete",
          JSON.stringify({
            fileId: file.id,
            path: file.savedFilePath,
          })
        );
        // Remove file from queue
        this._downloadQueue = this._downloadQueue.filter(
          (f) => f.id != file.id
        );
      })
      .on("close", () => {
        if (!downloaded) {
          this._browserWindow.webContents.send(
            "file-download-canceled",
            JSON.stringify({
              fileId: file.id,
            })
          );
          // Remove file from queue
          this._downloadQueue = this._downloadQueue.filter(
            (f) => f.id != file.id
          );
        }
      })
      .on("error", (err) => {
        this._browserWindow.webContents.send(
          "file-download-canceled",
          JSON.stringify({
            fileId: file.id,
          })
        );
        // Remove file from queue
        this._downloadQueue = this._downloadQueue.filter(
          (f) => f.id != file.id
        );
      });

    dl.on("build", (progress) => {
      this._browserWindow.webContents.send(
        "file-download-building",
        JSON.stringify({
          fileId: file.id,
          percent: progress.percentage,
        })
      );
    });
    // start download
    if (start) dl.start();

    file.downloadItemHandler = dl;

    this._downloadQueue.push(file);
  }

  async cancelDownload(fileId: string) {
    const file = this._downloadQueue.find((f) => f.id === fileId);
    if (file) {
      file.downloadItemHandler.destroy();
      await clean(file.savedFilePath).catch(console.log);
      // Remove file from queue
      this._downloadQueue = this._downloadQueue.filter((f) => f.id != file.id);
    }
  }

  async cancelAllDownloads() {
    for (const file of this._downloadQueue) {
      file.downloadItemHandler.destroy();
      await clean(file.savedFilePath).catch(console.log);
      // Remove file from queue
      this._downloadQueue = [];
    }
  }
}
