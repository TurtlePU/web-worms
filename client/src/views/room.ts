import { $, View } from '../lib/turtle';
import Router from '../lib/router';

import socket from '../lib/socket';

import { Graphics, Physics, Rules } from '../game/export';

const html = /* html */`
    <div><canvas id='canvas'></canvas></div>
    <div><button id='quit'>Quit</button></div>
`;

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class RoomView extends View {
    private animate: boolean;
    private last: number;

    constructor() {
        super('room', html);

        socket.on('room:start', (room_id: string) => {
            Router.navigate(`room/${room_id}`);
        });

        this.draw = this.draw.bind(this);
    }

    private draw(time: number) {
        Physics.update(time - this.last);
        this.last = time;
        Graphics.render();
        if (this.animate) {
            requestAnimationFrame(this.draw);
        }
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
            this.animate = false;
            socket.emit('room:left');
            Router.listen().navigate('join').check();
        }

        Graphics.init(<HTMLCanvasElement> $('canvas'));
        let { rules, physics } = await socket.request('game:scheme');
        Physics.init(physics);
        Rules.init(rules);

        this.animate = true;
        this.last = performance.now();
        requestAnimationFrame(this.draw);

        socket.request('game:ready');
    }
}
