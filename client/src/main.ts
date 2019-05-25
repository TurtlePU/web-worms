import Router from './lib/router';

import JoinView  from './views/join/script';
import LobbyView from './views/lobby/script';
import RoomView  from './views/room/script';

window.onload = async () => {
    const joinView  = new JoinView();
    const lobbyView = new LobbyView();
    const roomView  = new RoomView();

    Router
        .setRoot(joinView.id)
        .add(joinView.id, joinView.load)
        .add(/lobby\/(.+)/, lobbyView.load)
        .add(/room\/(.+)(\*)?/, roomView.load)
        .listen().navigate();
};
