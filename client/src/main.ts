import { Router } from './lib/turtle/router.js';

import JoinView from './views/join.js';
import LobbyView from './views/lobby.js';
import RoomView from './views/room.js';

window.onload = async () => {
    console.log(`Saved page: '${Cookies.get('view')}'`);
    const socket = io();
    const joinView = new JoinView();
    const lobbyView = new LobbyView();
    const roomView = new RoomView();
    Router
        .add(joinView.ID, (path: string) => {
            joinView.load(path, socket);
        })
        .add(/lobby\/(.+)/, (path: string, lobbyID: string) => {
            lobbyView.load(path, socket, lobbyID);
        })
        .add(/room\/(.+)/, (path: string, roomID: string) => {
            roomView.load(path, socket, roomID);
        })
        .listen()
        .navigate(Cookies.get('view') || joinView.ID, true);
};
