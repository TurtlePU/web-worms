import { $ } from '../lib/turtle/main.js';
import { SocketView } from '../lib/turtle/socket.view.js';
import { Router } from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Lobby</h1>
    <button id='back'>Back</button>
`;

export default class LobbyView extends SocketView {
    // TODO: LobbyView
    private lobbyID: string;

    constructor() { super('lobby', html); }

    load(path: string, socket: SocketIOClient.Socket, lobbyID: string) {
        super.load(path, socket);
        this.lobbyID = lobbyID;

        let back = <HTMLButtonElement> $('back');
        back.onclick = () => Router.navigate('join');
    }
}
