import { initSocket } from './lib/socket/wrapper.js';
import Router from './lib/turtle/router.js';

import JoinView  from './views/join.js';
import LobbyView from './views/lobby.js';
import RoomView  from './views/room.js';

window.onload = async () => {
    console.log(`Saved page: '${Cookies.get('view')}'`);

    initSocket();

    const joinView  = new JoinView();
    const lobbyView = new LobbyView();
    const roomView  = new RoomView();

    Router.root(joinView.ID)
        .add(joinView.ID,   joinView.load)
        .add(/lobby\/(.+)/, lobbyView.load)
        .add(/room\/(.+)/,  roomView.load)
        .listen().navigate();
};
