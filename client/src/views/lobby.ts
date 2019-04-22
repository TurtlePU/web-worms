import { socket } from '../lib/socket/wrapper.js';

import { $, View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Lobby</h1>
    <button id='back'>Back</button>
    <ol id='mems'></ol>
`;

function socketNode(id: string) {
    return /*html*/`<li id='socket-${id}'>${id}</li>`
}

function fail(message: string) {
    alert(message);
    Router.navigate('join');
}

export default class LobbyView extends View {
    private members: HTMLOListElement;

    constructor() {
        super('lobby', html);

        this.insertNode = this.insertNode.bind(this);

        socket.on('lobby:join', this.insertNode);
        socket.on('lobby:left', (socketID: string) => {
            this.members.removeChild($(`socket-${socketID}`));
        });
    }

    private insertNode(id: string) {
        this.members.insertAdjacentHTML(
            'beforeend', socketNode(id)
        );
    }

    async load(path: string, lobbyID: string) {
        super.load(path);

        let back = <HTMLButtonElement> $('back');
        back.onclick = () => {
            socket.emit('lobby:left');
            Router.navigate('join');
        }

        socket.channel('lobby');
        if (!await socket.request('check', lobbyID)) {
            return fail(`Such lobby doesn't exist: ${lobbyID}`);
        }
        if (!await socket.request('join', lobbyID)) {
            return fail(`Lobby is full: ${lobbyID}`);
        }

        this.members = <HTMLOListElement> $('mems');
        for (let socketID of await socket.request('members', lobbyID)) {
            this.insertNode(socketID);
        }
    }
}
