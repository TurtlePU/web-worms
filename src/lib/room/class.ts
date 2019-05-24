import { EventEmitter } from 'events';
import { Socket } from 'socket.io';

import { Handler } from './handler';
import { ISocketRoom } from './interface';
import { SocketInfo }  from './info';

/** Handles several sockets united in one 'Lobby' or 'Room'. */
export abstract class SocketRoom <
    SInfo extends SocketInfo
> extends EventEmitter implements ISocketRoom {
    /** Unique short identifier. */
    readonly id: string;
    /** Sockets connected to the room. */
    protected sockets: Socket[];
    /** Info of connected sockets in this room context. */
    protected socketInfo: Map<String, SInfo>;

    /**
     * Makes new room.
     * @param id - string id of a new room.
     */
    protected constructor(id: string) {
        super();
        this.id = id;
        this.flush();
    }

    get_socket_list() {
        return [...this.sockets];
    }

    add(socket: Socket) {
        this.sockets.push(socket);
        socket.join(this.id);
        this.socketInfo.set(
            socket.id,
            this.SocketInfo(
                this.handlers(socket)
            )
        );
        this.connect(socket);
        return true;
    }

    /**
     * Broadcasts message to all its sockets.
     * @param event
     * @param args
     */
    cast(event: string | symbol, ...args: any[]) {
        return this.sockets.length &&
               this.sockets[0].server.to(this.id).emit(event, ...args);
    }

    flush() {
        this.sockets = [];
        this.socketInfo = new Map();
    }

    /**
     * Removes socket from the list, deletes room-specific handlers.
     * @param socket - socket to remove.
     */
    remove(socket: Socket) {
        let index = this.sockets.findIndex(element => {
            return element.id == socket.id;
        });
        if (index != -1) {
            this.sockets.splice(index, 1);
            socket.leave(this.id);
            this.disconnect(socket);
            this.socketInfo.delete(socket.id);
        }
        return index != -1;
    }

    /**
     * Adds room-specific listeners to given socket.
     * @param socket 
     */
    protected connect(socket: Socket) {
        for (let { event, callback } of this.socketInfo.get(socket.id).handlers) {
            socket.on(event, callback);
        }
    }

    /**
     * Removes room-specific listeners from given socket.
     * @param socket
     */
    protected disconnect(socket: Socket) {
        for (let { event, callback } of this.socketInfo.get(socket.id).handlers) {
            socket.removeListener(event, callback);
        }
    }

    /**
     * Removes room-specific listeners
     * from all sockets connected to this room.
     */
    protected disconnectAll() {
        for (let socket of this.sockets) {
            this.disconnect(socket);
        }
    }

    /**
     * Returns room-specific handlers for given socket.
     * @param socket
     */
    protected abstract handlers(socket: Socket): Handler[]

    /**
     * Makes socket info from handlers list.
     * @param handlers 
     */
    protected abstract SocketInfo(handlers: Handler[]): SInfo
}
