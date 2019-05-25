import socket from '../lib/socket';

import { $, View } from '../lib/turtle';
import Router from '../lib/router';

const html = /* html */`
    <h1>Lobby</h1>
    <button id='back'>Back</button>
    <input type='checkbox' id='ready'>
    <button id='start' disabled='true'>Start</button>
    <table><tbody id='mems'></tbody></table>
`;

function ready_sign(ready: boolean) {
    return ready ? '✔️' : '❌';
}

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class LobbyView extends View {
    private public_id: string;

    constructor() {
        super('lobby', html);

        socket
        .on('lobby:join', async (socketID: string, ready: boolean, first: boolean) => {
            this.public_id = await socket.request('lobby:getme');
            this.insertNode(socketID, ready, first);
        })
        .on('lobby:ready', (socketID: string, ready: boolean) => {
            $(`ready-${socketID}`).innerHTML = ready_sign(ready);
        })
        .on('lobby:start-enabled', (enabled: boolean) => {
            (<HTMLButtonElement> $('start')).disabled = !enabled;
        })
        .on('lobby:left', (socketID: string) => {
            $('mems').removeChild($(`socket-${socketID}`));
        });
    }

    private insertNode(id: string, ready: boolean, first: boolean) {
        if ($(`socket-${id}`)) {
            return;
        }
        $('mems').innerHTML += /*html*/`
            <tr id='socket-${id}'>${this.socketText(id, ready, first)}</tr>
        `;
    }

    private socketText(id: string, ready: boolean, first: boolean) {
        return /*html*/`
            <td>${id}</td>
            <td id='ready-${id}'>${ready_sign(ready)}</td>
            <td>${id == this.public_id ? '⬅️' : ''}${first ? '🥇' : ''}</td>
        `;
    }

    async load(path: string, lobbyID: string) {
        super.load(path);

        $('back').onclick = () => {
            socket.emit('lobby:left');
            Router.navigate('join');
        };

        $('ready').onclick = () => {
            socket.emit('lobby:ready', (<HTMLInputElement>$('ready')).checked);
        };

        $('start').onclick = async () => {
            if (!await socket.request('lobby:start')) {
                alert('Not everyone is ready');
            }
        };

        if (!await socket.request('lobby:check', lobbyID)) {
            return fail(`Such lobby doesn't exist: ${lobbyID}`);
        }
        if (!await socket.request('lobby:join', lobbyID)) {
            return fail(`Lobby is full: ${lobbyID}`);
        }

        for (let [ id, ready, first ] of await socket.request('lobby:members', lobbyID)) {
            this.insertNode(id, ready, first);
        }

        this.public_id = await socket.request('lobby:getme');
    }
}
