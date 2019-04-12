import socket from "socket.io";

// TODO: Broadcaster
/** Broadcasts servers for a room. */
export default class Broadcaster {
    private channel: string;
    private events: string[];
    private io: socket.Server;

    // TODO: add room
    constructor(io: socket.Server, channel: string) {
        this.channel = channel;
        this.events = [];
        this.io = io;
    }

    on(event: string) {
        this.events.push(event);
    }

    apply(socket: socket.Socket) {
        let channel = this.channel;
        this.events.forEach(event => {
            socket.on(`${channel}:${event}:send`, (...args: any[]) => {
                this.io.emit(`${channel}:${event}:receive`, ...args);
            });
        });
    }
};
