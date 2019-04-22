///<reference path='socket.io.d.ts'/>
///<reference path='socket.wrap.d.ts'/>

var initialized = false;

export var socket: SocketIOClient.Socket;

export function initSocket() {
    if (initialized) {
        return;
    }
    initialized = true;

    socket = io();

    socket.request = async (request: string, ...args: any[]) => {
        return new Promise((resolve, reject) => {
            console.log(`socket.request <= ${request}`);
            let timeout = window.setTimeout(() => {
                reject(`${request}: Connection timed out`);
            }, 10 * 1000);
            socket.emit(request, ...args, (...args: any[]) => {
                window.clearTimeout(timeout);
                console.log(`socket.request =>`, ...args);
                resolve(...args);
            });
        });
    };
};
