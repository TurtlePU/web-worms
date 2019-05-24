import Router from './lib/router';

import JoinView  from './views/join';
import LobbyView from './views/lobby';
import RoomView  from './views/room';

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
