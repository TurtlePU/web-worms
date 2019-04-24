///<reference path='../lib/js.cookie.d.ts'/>

import { View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

import { socket } from '../lib/socket/wrapper.js';

const html = /* html */`
`;

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class RoomView extends View {
    constructor() {
        super('room', html);

        socket
        .on('room:start', (roomID: string) => {
            Router.navigate(`room/${roomID}`);
        })
    }

    initGraphics() {
        // TODO: init graphics
    }

    initPhysics(...args: any[]) {
        // TODO: init physics
    }

    initGame(...args: any[]) {
        // TODO: init game constants & rules
    }

    async load(path: string, roomID: string) {
        super.load(path);

        if (!await socket.request('room:check', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is inaccessible from old socket`);
        }
        if (!await socket.request('room:join', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is full`);
        }

        // TODO: init UI

        this.initGraphics();
        this.initPhysics(await socket.request('room:scheme:physics'));
        this.initGame(await socket.request('room:scheme:game'));
    }
}
