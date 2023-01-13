import {createWebHashHistory, createRouter, RouteRecordRaw,} from 'vue-router'
import Home from "./screens/Home.vue";
import ShareRoomHome from "./screens/ShareRoom/ShareRoomHome.vue";
import TransferHub from "./screens/ShareRoom/TransferHub.vue";
import People from "./screens/ShareRoom/People.vue";
import Files from "./screens/ShareRoom/Files.vue";
import JoinShareRoom from "./screens/JoinRoom.vue";
import RoomRadar from "./screens/RoomRadar.vue";

const routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/room-radar', component: RoomRadar },
    { path: '/join-room', component: JoinShareRoom },
    {
        path: '/share-room',
        component: ShareRoomHome,
        children: [
            {
                path: '',
                component: TransferHub
            },
            {
                path: 'people',
                component: People
            },
            {
                path: 'files',
                component: Files
            },
        ]
    }
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes // short for `routes: routes`
})

export default router;