import socket from 'socket.io';

/**
 * Wrapper on Socket server for game needs.
 * 
 * @param server Server to retrieve events from
 * @returns Socket server with binded game events
 */
export default function IO(server: any) {
    const io = socket(server);

    io.on('connection', socket => {
        console.log('new socket connected');
        socket.on('disconnect', () => {
            console.log('socket disconnected');
        })
    });

    return io;
}
