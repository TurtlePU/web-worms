///<reference path='socket.io.d.ts'/>
///<reference path='socket.wrap.d.ts'/>

const field = {
    channel: '',
    initialized: false
};

export var socket: SocketIOClient.Socket;

export function initSocket() {
    if (!field.initialized) {
        field.initialized = true;

        socket = io();

        socket.channel = (name: string) => {
            field.channel = name;
            return socket;
        };

        socket.request = async (request: string, ...args: any[]) => {
            let fullname = `${field.channel}:${request}`;
            console.log(`socket.request <= ${fullname}`);
            return new Promise((resolve, reject) => {
                let timeout: number;
                socket.once(`${fullname}:res`, (...args: any) => {
                    window.clearTimeout(timeout);
                    console.log(`socket.request =>`, ...args);
                    resolve(...args);
                });
                socket.emit(`${fullname}:req`, ...args);
                timeout = window.setTimeout(() => {
                    reject(`${fullname}: Connection timed out`);
                }, 10 * 1000);
            });
        };

        socket.cast = (event: string, ...args: any[]) => {
            return socket.emit(`${field.channel}:${event}:send`, ...args);
        };

        socket.onCast = (event: string, fn: Function) => {
            let fullname = `${field.channel}:${event}:receive`;
            return socket.on(fullname, fn);
        };
    }
};
