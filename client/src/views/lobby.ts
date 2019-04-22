import { socket } from '../lib/socket/wrapper.js';

import { $, View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

// TODO: ready/not ready logic, start game (for any? player)

const html = /* html */`
    <h1>Lobby</h1>
    <button id='back'>Back</button>
    <ol id='mems'></ol>
`;

function socketNode(id: string) {
    return /*html*/`<li id='socket-${id}'>${id}</li>`
}

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class LobbyView extends View {
    private members: HTMLOListElement;
    private memlist: Set<string>;

    constructor() {
        super('lobby', html);

        this.insertNode = this.insertNode.bind(this);

        socket.on('lobby:join', this.insertNode);
        socket.on('lobby:left', (socketID: string) => {
            this.memlist.delete(socketID);
            this.members.removeChild($(`socket-${socketID}`));
        });
    }

    private insertNode(id: string) {
        if (this.memlist.has(id)) {
            return;
        }
        this.memlist.add(id);
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

        if (!await socket.request('lobby:check', lobbyID)) {
            return fail(`Such lobby doesn't exist: ${lobbyID}`);
        }
        if (!await socket.request('lobby:join', lobbyID)) {
            return fail(`Lobby is full: ${lobbyID}`);
        }

        this.memlist = new Set();
        this.members = <HTMLOListElement> $('mems');
        for (let socketID of await socket.request('lobby:members', lobbyID)) {
            this.insertNode(socketID);
        }
    }
}
