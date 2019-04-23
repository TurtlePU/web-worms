import { socket } from '../lib/socket/wrapper.js';

import { $, View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

// TODO: start game (for any? player)

const html = /* html */`
    <h1>Lobby</h1>
    <button id='back'>Back</button>
    <input type='checkbox' id='ready'>
    <table><tbody id='mems'></tbody></table>
`;

function socketText(id: string, ready: boolean) {
    return /*html*/`
        <td>${id}</td><td>${ready ? '✔️' : '❌'}</td>
    `;
}

function socketNode(id: string, ready: boolean) {
    return /*html*/`
        <tr id='socket-${id}'>${socketText(id, ready)}</tr>
    `;
}

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class LobbyView extends View {
    constructor() {
        super('lobby', html);

        socket
        .on('lobby:join', (socketID: string) => {
            this.insertNode(socketID, false);
        })
        .on('lobby:ready', (socketID: string, ready: boolean) => {
            $(`socket-${socketID}`).innerHTML = socketText(socketID, ready);
        })
        .on('lobby:left', (socketID: string) => {
            $(`mems`).removeChild($(`socket-${socketID}`));
        });
    }

    private insertNode(id: string, ready: boolean) {
        if ($(`socket-${id}`)) {
            return;
        }
        $('mems').innerHTML += socketNode(id, ready);
    }

    async load(path: string, lobbyID: string) {
        super.load(path);

        let back = <HTMLButtonElement> $('back');
        back.onclick = () => {
            socket.emit('lobby:left');
            Router.navigate('join');
        }

        let ready = <HTMLInputElement> $('ready');
        ready.onclick = () => {
            socket.emit('lobby:ready');
        }

        if (!await socket.request('lobby:check', lobbyID)) {
            return fail(`Such lobby doesn't exist: ${lobbyID}`);
        }
        if (!await socket.request('lobby:join', lobbyID)) {
            return fail(`Lobby is full: ${lobbyID}`);
        }

        for (let { id, ready } of await socket.request('lobby:members', lobbyID)) {
            this.insertNode(id, ready);
        }
    }
}
