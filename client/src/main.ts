import Router from './lib/turtle/router.js';

import JoinView  from './views/join.js';
import LobbyView from './views/lobby.js';
import RoomView  from './views/room.js';

window.onload = async () => {
    const joinView  = new JoinView();
    const lobbyView = new LobbyView();
    const roomView  = new RoomView();

    Router
    .setRoot(joinView.id)
    .add(joinView.id,   joinView.load)
    .add(/lobby\/(.+)/, lobbyView.load)
    .add(/room\/(.+)/,  roomView.load)
    .listen().navigate();
};
