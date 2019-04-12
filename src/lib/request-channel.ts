import { Socket } from 'socket.io';

type RequestType = {
    name: string,
    handler: (...args: any[]) => any
}

/** Request channel based on Socket.io. */
export default class RequestChannel {
    private readonly channel: string;
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
     * Adds a request listener on the channel.
     * @param name - name of the request
     * @param handler - request listener
     * @returns @this
     */
    on(name: string, handler: (...args: any[]) => any) {
        this.requests.push({ name, handler });
        return this;
    }

    /**
     * Adds request listeners to the socket. Can be used multiple times.
     * @param socket - socket to add listeners to
     */
    apply(socket: Socket) {
        for (let { name, handler } of this.requests) {
            socket.on(`${this.channel}:${name}:req`, (...args) => {
                socket.emit(`${this.channel}:${name}:res`, handler(...args));
            });
        }
    }
}
