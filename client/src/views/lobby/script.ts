import Router from 'router';
import socket from 'socket';

import { readFileSync } from 'fs';
import { $, View } from 'turtle';

export default class LobbyView extends View {
    private public_id: string;

    constructor() {
        super('lobby', readFileSync(__dirname + '/view.html', 'utf8'));

        socket
            .on('lobby:join', (socketID: string, ready: boolean, first: boolean) => {
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

        this.public_id = await socket.request('lobby:getme');

        for (let [ id, ready, first ] of await socket.request('lobby:members', lobbyID)) {
            this.insertNode(id, ready, first);
        }
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
}

function ready_sign(ready: boolean) {
    return ready ? '✔️' : '❌';
}

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}
