import socket, { Socket } from 'socket.io';

class SocketHandler {
    constructor(socket: Socket) {
        console.log('new socket connected');

        // FIXME: requests from client/Join

        socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
    }
}

/**
 * Wrapper on Socket server for game needs.
 * 
 * @param server Server to retrieve events from
 * @returns Socket server with binded game events
 */
export default function IO(server: any) {
    const io = socket(server);
    io.on('connection', socket => new SocketHandler(socket));
    return io;
}
