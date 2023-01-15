import express, {Application} from "express";
import cors from 'cors';
import {createServer, Server} from "http";
import {Server as SocketServer, Socket} from "socket.io";
import CONSTANTS from "../utils/constants";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {ShareRoom} from "./ShareRoom";
import * as bodyParser from "body-parser";
import {SHARE_ROOM_EVENTS} from "../../models/socket-events";
import {generateUID} from "../utils/utility";
import {DeviceModel, ShareRoomModel} from "../../models";

export class AppServer {
    private readonly _expressApp: Application;
    private readonly _httpServer: Server;
    private io: SocketServer<DefaultEventsMap>;

    private _shareRoom: ShareRoom

    constructor() {
        this._expressApp = express();
        this._expressApp.use(cors());
        this._expressApp.use(bodyParser.urlencoded({extended: false}));
        this._httpServer = createServer(this._expressApp);
        this.io = new SocketServer(this._httpServer, {
            httpCompression: true,
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT"],
                // allowedHeaders: ["Access-Allow-Origin"],
                credentials: true
            }
        });
        this._shareRoom = new ShareRoom();
        this.initRoutes();
        this.initConnectionListener();
    }

    getHttpServer(): Server {
        return this._httpServer;
    }

    getShareRoom(): ShareRoom {
        return this._shareRoom;
    }

    startServer() {
        this._httpServer.listen(CONSTANTS.PUBLIC_PORT)
    }

    private initConnectionListener() {
        // middle to authenticate user
        this.io.use((socket, next) => {
            try {
                if (!this._shareRoom.isRoomActive()) {
                    next(new Error("NO_ACTIVE_ROOM"));
                    return;
                }
                // if room is full reject
                if (this._shareRoom.getRoom().participants.length >= this._shareRoom.getRoom().maxParticipants) {
                    next(new Error('ROOM_FULL'));
                    return;
                }
                // If passcode is correct
                if (socket.handshake.auth && socket.handshake.auth.passcode) {
                    if (socket.handshake.auth.passcode.toString() != this.getShareRoom().getRoom().passcode) {
                        next(new Error('AUTH_ERROR'));
                        return;
                    }
                    next();
                } else {
                    next(new Error('ACCESS_DENIED'));
                }
            } catch (e) {
                console.log(e);
                next(new Error('ERROR_OCCURRED'));
            }
        }).on("connection", (socket) => {
            const device = JSON.parse(socket.handshake.query.device as string) as DeviceModel;
            // set the joining date...
            device.joinedOn = (new Date().toISOString());
            /**
             * If user is already in room, don't add.
             * It is possible that the person was disconnected from the socket and is still in
             * the participants array..
             */
            if (!this._shareRoom.getRoom().participants.find(p => p.id == device.id)) {
                // add person to devices list
                this._shareRoom.addToRoom(device);
                // emit person added event
                this.io.emit(SHARE_ROOM_EVENTS.ON_DEVICES_CHANGE, JSON.stringify(this._shareRoom.getRoom().participants));
            }
            // Add connection room
            socket.join(this._shareRoom.getRoom().name)
            // Start room events for files, devices etc
            this.initRoomListeners(socket);
            // on disconnection
            socket.on("disconnect", (reason) => {
                this._shareRoom.removeParticipant(device.id);
                this.io.emit(SHARE_ROOM_EVENTS.ON_DEVICES_CHANGE, JSON.stringify(this._shareRoom.getRoom().participants));
            });
        })
    }

    initRoutes() {
        // get Share room info
        this._expressApp.use((req, res, next) => {
            if (!req.path.toString().startsWith('/download') && !this._shareRoom.isRoomActive()) {
                return res.status(405).json({code: 'NO_ACTIVE_ROOM'})
            }
            next();
        });
        this._expressApp.get('/share-room', (req, res) => {
            if (!this._shareRoom.isRoomActive()) {
                return res.status(405).json({code: 'NO_ACTIVE_ROOM'})
            }

            res.status(200).json({data: this._shareRoom.getRoom(), message: 'Room fetched'})
        });
        // Download file
        this._expressApp.get('/download/', async (req, res, next) => {
            const {path, type} = req.query;
            try {
                // const fileName = basename(path.toString())
                // const stream = createReadStream(path.toString());
                // const disposition = 'attachment; filename="' + fileName + '"';
                //
                // res.attachment(fileName)
                // res.setHeader('Content-Type', type.toString());
                // res.setHeader('Content-Disposition', disposition);
                //
                // stream.pipe(res);
                res.download(path.toString())
            } catch (err) {
                res.sendStatus(500);
            }
        });

    }

    initRoomListeners(socket: Socket) {
        // when a file is added to room
        socket.on(SHARE_ROOM_EVENTS.ON_FILE_ADD, (data) => {
            let files = JSON.parse(data).files;
            // Only add files that are not in the room
            files = files
                .filter(file => {
                    const exist = this._shareRoom.getRoom().files.findIndex(rf => {
                        return rf.device.id == file.device.id && rf.device.path === file.device.path
                    });
                    return exist < 0;
                })
                .map(file => {
                    // Add Ids and shared Date to files
                    return {
                        id: generateUID('doc', (this._shareRoom.getRoom().files.length + 1).toString()),
                        sharedDate: (new Date()).toISOString(),
                        ...file
                    }
                });
            // Add files to room data
            this._shareRoom.getRoom().files = [...files, ...this._shareRoom.getRoom().files]
            this.io.emit(SHARE_ROOM_EVENTS.ON_FILE_ADD, files)
        })
    }

    async createRoom(name: string, maxParticipants = null): Promise<ShareRoomModel> {
        if (this._shareRoom.isRoomActive()) return this._shareRoom.getRoom();
        return this._shareRoom.createRoom(name, maxParticipants)
    }

    closeRoom() {
        this.io.disconnectSockets()
        this._shareRoom.closeRoom();
    }

    stopServer() {
        this._httpServer.close();
    }
}
