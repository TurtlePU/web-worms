import { Socket } from 'socket.io';

type RequestType = {
    name: string,
    handler: (...args: any[]) => any
}

/** Interface for Requester. */
export default class Requester {
    private channel: string;
    private requests: RequestType[];

    /**
     * @constructor
     * @param channel - name of a request channel
     */
    constructor(channel: string) {
        this.channel = channel;
        this.requests = [];
    }

    /**
     * Adds a request on the channel.
     * @param name - name of the request
     * @param handler - request executor
     * @returns @this
     */
    on(name: string, handler: (...args: any[]) => any) {
        this.requests.push({ name, handler });
        return this;
    }

    /**
     * Adds request handlers to the socket. After applying, Requester won't work.
     * @param socket - socket to add handlers to
     */
    apply(socket: Socket) {
        for (let { name, handler } of this.requests) {
            socket.on(`${this.channel}:${name}:req`, (...args) => {
                socket.emit(`${this.channel}:${name}:res`, handler(...args));
            });
        }
        this.channel = '';
        this.requests = [];
    }
}
