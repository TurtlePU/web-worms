import socket from 'socket.io';

/** Broadcast channel for a room based on Socket.io. */
export default class BroadcastChannel {
    /** Name of a channel. */
    private readonly channel: string;

    /** List of channel's events. */
    private events: string[];

    /**
     * @constructor
     * @param channel - name of a channel 
     */
    constructor(channel: string) {
        this.channel = channel;
        this.events = [];
    }

    /**
     * Adds new event(s) for subscribers to listen to.
     * @param events - string identifier(s) of an event
     * @returns @this
     */
    open(...events: string[]) {
        this.events.push(...events);
        return this;
    }

    /**
     * Adds broadcast-start listeners to the socket. Can be used multiple times.
     * !!! Important: events are broadcasted for a first room of socket. 
     * @param socket - socket to add listeners to
     */
    plug(socket: socket.Socket) {
        this.events.forEach(event => {
            socket.on(`${this.channel}:${event}:send`, (...args: any[]) => {
                socket.server
                    .to(socket.rooms[0])
                    .emit(`${this.channel}:${event}:receive`, ...args);
            });
        });
    }
};
