import socket from '../lib/socket/wrapper.js';

import { $, View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Lobby</h1>
    <button id='back'>Back</button>
`;

export default class LobbyView extends View {
    // TODO: LobbyView
    private lobbyID: string;

    constructor() {
        super('lobby', html);
    }

    load(path: string, lobbyID: string) {
        super.load(path);
        this.lobbyID = lobbyID;

        let back = <HTMLButtonElement> $('back');
        back.onclick = () => Router.navigate('join');
    }
}
