///<reference path='../lib/js.cookie.d.ts'/>

import { $, View } from '../lib/turtle/export.js';
import Router from '../lib/turtle/router.js';

import socket from '../lib/socket/wrapper.js';

import { Graphics, Physics, Rules } from '../game/export.js';

const html = /* html */`
    <button id='quit'>Quit</button>
`;

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class RoomView extends View {
    private graphics: Graphics;
    private physics: Physics;
    private rules: Rules;

    constructor() {
        super('room', html);

        socket
        .on('room:start', (roomID: string) => {
            Cookies.set('socket', socket.id);
            Router.navigate(`room/${roomID}`);
        });
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

        $('quit').onclick = () => Router.listen().navigate('join').check();

        this.graphics = new Graphics();
        this.physics  = new Physics(await socket.request('room:scheme:physics'));
        this.rules    = new Rules(await socket.request('room:scheme:game'));
    }
}
