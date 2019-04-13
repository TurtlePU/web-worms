///<reference path='socket.io.d.ts'/>
///<reference path='socket.wrap.d.ts'/>

const socket = io();
var channel = '';

socket.channel = (name: string) => {
    channel = name;
    return socket;
};

socket.request = (name: string, ...args: any[]) => {
    // TODO: Socket.request
    return new Promise((_, __) => {});
};

export default socket;
