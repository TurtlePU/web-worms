///<reference path='../lib/socket.io.d.ts'/>

import { $, View } from '../lib/turtle/main.js';
import { Router } from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Room</h1>
    <button id='back'>Back</button>
`;

export class RoomView extends View<string> {
    constructor() { super('room', html); }

    load(roomID: string) {
        super.load(roomID);
        Cookies.set('view', `${this.ID}/${this.props}`);

        let back = <HTMLButtonElement> $('back');
        back.addEventListener('click', () => Router.navigate(''));
    }
}
