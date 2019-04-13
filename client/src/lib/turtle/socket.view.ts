///<reference path='../socket/socket.io.d.ts'/>

import { View } from './main.js';

export class SocketView extends View {
    /** Socket from which to listen / whom to emit */
    protected socket: SocketIOClient.Socket;

    /**
     * Simple wrapper for socket requests.
     * 
     * @param request - unique base for event names 
     * @param args - request parameters
     */
    protected async socketRequest(request: string, ...args: any) {
        console.log(`${this.ID}:${request}`);
        return new Promise((resolve, reject) => {
            let timeout: number;
            this.socket.once(`${this.ID}:${request}:res`, (...args: any) => {
                window.clearTimeout(timeout);
                resolve(...args);
            });
            this.socket.emit(`${this.ID}:${request}:req`, ...args);
            timeout = window.setTimeout(() => {
                reject(`${this.ID}:${request}: Connection timed out`);
            }, 10 * 1000);
        });
    }

    /**
     * Loads the view.
     * @override
     * 
     * @param path - path from which View was loaded 
     * @param socket - socket for listening
     * @param args - any load properties defined in subclasses
     */
    load(path: string, socket: SocketIOClient.Socket, ...args: any) {
        super.load(path);
        this.socket = socket;
    }
}
