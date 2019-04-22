import { View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

import { socket } from '../lib/socket/wrapper.js';

const html = /* html */`
`;

export default class RoomView extends View {
    // TODO: RoomView
    private roomID: string;

    constructor() {
        super('room', html);
    }

    async load(path: string, roomID: string) {
        let exists = await socket.channel('room')
            .request('check', roomID, Cookies.get('socket'));
        if (!exists) {
            alert(`Such lobby doesn't exist: ${roomID}`);
            Router.navigate('join');
        }

        super.load(path);
        this.roomID = roomID;
    }
}