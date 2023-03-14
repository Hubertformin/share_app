# ShareRoom
This File transfer desktop application built with Electron.js, Node.js, Vue.js. This desktop application works for devices that are connected to the same network.

## How it works
First all devices with this application will have to be connected to the same network. One application creates a share room, this computer will be the host computer that keeps tracks of files added to this room. Other devices in the network will scan for available room, then join any open rooms. 
All devices in a room can share and download files shared to the room.

## Screenshots

## Install
```bash
$ git pull https://github.com/Hubertformin/share_app.git
$ cd share_app && yarn install
```

## Developing
#### Running the local development server
```bash
$ yarn dev
```

#### Building
```bash
$ yarn build
```