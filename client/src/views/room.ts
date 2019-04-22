///<reference path='../lib/js.cookie.d.ts'/>

import { View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

import { socket } from '../lib/socket/wrapper.js';

// TODO: game itself

const html = /* html */`
`;

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class RoomView extends View {
    constructor() {
        super('room', html);
    }

    async load(path: string, roomID: string) {
        super.load(path);

        if (!await socket.request('room:check', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is inaccessible from old socket`);
        }
        // TODO: join room on server
        if (!await socket.request('room:join', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is full`);
        }
    }
}