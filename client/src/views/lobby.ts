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

function socketText(id: string, ready: boolean, first: boolean) {
    return /*html*/`
        <td>${id}</td>
        <td>${ready ? '✔️' : '❌'}</td>
        <td>${id == socket.id ? '⬅️' : ''}${first ? '🥇' : ''}</td>
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
        .on('lobby:join', (socketID: string, ready: boolean, first: boolean) => {
            this.insertNode(socketID, ready, first);
        })
        .on('lobby:ready', (socketID: string, ready: boolean, first: boolean) => {
            $(`socket-${socketID}`).innerHTML = socketText(socketID, ready, first);
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
            <tr id='socket-${id}'>${socketText(id, ready, first)}</tr>
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

        for (let { id, ready, first } of await socket.request('lobby:members', lobbyID)) {
            this.insertNode(id, ready, first);
        }
    }
}
