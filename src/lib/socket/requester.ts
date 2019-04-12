import { Socket } from 'socket.io';

/** Interface for Requester. */
export interface Requester {
    /**
     * Sets channel on which to add requests.
     * @param name - name of the channel
     * @returns Requester
     */
    channel(name: string): this,

    /**
     * Adds a request on the channel.
     * @param name - name of the request
     * @param handler - request executor
     * @returns Requester
     */
    on(name: string, handler: (...args: any[]) => any): this,

    /**
     * Adds request handlers to the socket. All the added handlers are flushed from the Requester.
     * @param socket - socket to add handlers to
     */
    apply(socket: Socket): void
}

type RequestType = {
    name: string,
    handler: (...args: any[]) => any
}

const helper = {
    channel: '',
    requests: [] as RequestType[]
};

/** Singleton to serialise setting of requests from a socket. */
export const Requester = {
    channel(name: string): Requester {
        helper.channel = name;
        return Requester;
    },

    on(name: string, handler: (...args: any[]) => any): Requester {
        helper.requests.push({ name, handler });
        return Requester;
    },

    apply(socket: Socket) {
        for (let { name, handler } of helper.requests) {
            socket.on(`${helper.channel}:${name}:req`, (...args) => {
                socket.emit(`${helper.channel}:${name}:res`, handler(...args));
            });
        }
        helper.requests = [];
    }
} as Requester;
