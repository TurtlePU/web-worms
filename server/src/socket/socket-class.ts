import StatePool from './state-pool';

import { dummy } from './socket-state';
import { beautify } from '../lib/id-generator';

export class Socket {
    readonly id: string;
    readonly public_id: string;
    private socket: SocketIO.Socket;

    constructor(socket: SocketIO.Socket) {
        this.id = socket.id;
        this.public_id = beautify(this.id);
        this.socket = socket;
    }

    get ready() {
        return StatePool.get(this.id).ready;
    }

    get room_id() {
        return StatePool.get(this.id).room_id;
    }

    set ready(ready: boolean) {
        StatePool.set(this.id, { ready });
    }

    emit(event: string, ...args: any[]) {
        this.socket.emit(event, ...args);
    }

    on(event: string, callback: (...args: any) => void) {
        this.socket.on(event, callback);
        return this;
    }

    join(room_id: string) {
        this.socket.join(room_id);
        StatePool.set(this.id, {
            ready: false, room_id
        });
    }

    leave(room_id: string) {
        this.socket.leave(room_id);
        StatePool.set(this.id, {
            ready: false,
            room_id: dummy.room_id
        });
    }
}
