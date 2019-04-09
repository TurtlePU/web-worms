///<reference path='../lib/socket.io.d.ts'/>

import { $, View } from '../lib/turtle/main.js';
import { Router } from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Room</h1>
    <button id='back'>Back</button>
`;

export default class RoomView extends View<string> {
    private socket: SocketIOClient.Socket;

    constructor() { super('room', html); }

    load(path: string, roomID: string) {
        super.load(path, roomID);

        this.socket = io();

        this.socket.once('req:getRoom', () => {
            this.socket.emit('res:getRoom', roomID);
        });

        this.socket.once('auth:reject', () => {
            Router.navigate('join');
        });

        let back = <HTMLButtonElement> $('back');
        back.onclick = () => {
            Router.navigate('join');
            this.socket.close();
        };

        Cookies.set('socket', this.socket.id);
    }
}
