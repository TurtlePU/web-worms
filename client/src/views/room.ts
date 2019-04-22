import { View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

import { socket } from '../lib/socket/wrapper.js';

const html = /* html */`
`;

function fail(message: string) {
    alert(message);
    Router.navigate('join');
}

export default class RoomView extends View {
    // TODO: RoomView
    private roomID: string;

    constructor() {
        super('room', html);
    }

    async load(path: string, roomID: string) {
        super.load(path);
        this.roomID = roomID;

        socket.channel('room');
        if (!await socket.request('check', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is inaccessible from old socket`);
        }
        if (!await socket.request('join', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is full`);
        }
    }
}