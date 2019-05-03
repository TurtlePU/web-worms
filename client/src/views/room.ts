///<reference path='../lib/js.cookie.d.ts'/>

import { $, View } from '../lib/turtle/export.js';
import Router from '../lib/turtle/router.js';

import socket from '../lib/socket/wrapper.js';

import { Graphics, Physics, Rules } from '../game/export.js';

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

        socket
        .on('room:start', (roomID: string) => {
            Cookies.set('socket', socket.id);
            Router.navigate(`room/${roomID}`);
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

    async load(path: string, roomID: string) {
        super.load(path);

        if (!await socket.request('room:check', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is inaccessible from old socket`);
        }
        if (!await socket.request('room:join', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is full`);
        }

        Cookies.set('room', roomID);
        Router.unlisten();

        $('quit').onclick = () => {
            this.animate = false;
            Router.listen().navigate('join').check();
        }

        Graphics.init(<HTMLCanvasElement> $('canvas'));
        Physics.init(await socket.request('room:scheme:physics'));
        Rules.init(await socket.request('room:scheme:game'));

        this.animate = true;
        this.last = performance.now();
        requestAnimationFrame(this.draw);
    }
}
