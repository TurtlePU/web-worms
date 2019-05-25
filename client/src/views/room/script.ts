import Router from 'router';
import socket from 'socket';

import { readFileSync } from 'fs';
import { $, View } from 'turtle';

export default class RoomView extends View {
    constructor() {
        super('room', readFileSync(__dirname + '/view.html', 'utf8'));

        socket.on('room:start', (room_id: string) => {
            Router.navigate(`room/${room_id}`);
        });
    }

    async load(path: string, room_id: string, reconnect?: string) {
        super.load(path);

        if (reconnect) {
            if (!await socket.request('room:reconnect')) {
                fail('Failed to reconnect');
                return;
            }
        } else {
            if (!await socket.request('room:checkme', room_id)) {
                fail('Aborted connection to the room');
                return;
            }
        }

        Router.unlisten();

        $('quit').onclick = () => {
            socket.emit('room:left');
            Router.listen().navigate('join').check();
        }

        let { rules, physics } = await socket.request('game:scheme');
        // TODO: game

        socket.request('game:ready');
    }
}

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}
