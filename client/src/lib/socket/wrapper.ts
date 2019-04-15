///<reference path='socket.io.d.ts'/>
///<reference path='socket.wrap.d.ts'/>

var socket: SocketIOClient.Socket;
var channel = '';

socket.channel = (name: string) => {
    channel = name;
    return socket;
};

socket.request = async (request: string, ...args: any[]) => {
    let fullname = `${channel}:${request}`;
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

export function init() {
    socket = io();
}

export default socket;
