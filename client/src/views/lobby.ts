import { socket } from '../lib/socket/wrapper.js';

import { $, View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Lobby</h1>
    <button id='back'>Back</button>
    <ol id='mems'></ol>
`;

function listNode(text: string) {
    return /*html*/`<li>${text}</li>`
};

function fail(message: string) {
    alert(message);
    Router.navigate('join');
}

export default class LobbyView extends View {
    private lobbyID: string;
    private members: HTMLUListElement;

    constructor() {
        super('lobby', html);
        // TODO: lobby change events
    }

    async load(path: string, lobbyID: string) {
        super.load(path);
        this.lobbyID = lobbyID;

        let back = <HTMLButtonElement> $('back');
        back.onclick = () => Router.navigate('join');

        socket.channel('lobby');
        if (!await socket.request('check', lobbyID)) {
            return fail(`Such lobby doesn't exist: ${lobbyID}`);
        }
        if (!await socket.request('join', lobbyID)) {
            return fail(`Lobby is full: ${lobbyID}`);
        }

        this.members = <HTMLUListElement> $('mems');
        for (let mem of await socket.request('members', lobbyID)) {
            this.members.insertAdjacentHTML('beforeend', listNode(mem));
        }
    }
}
