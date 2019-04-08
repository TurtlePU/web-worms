import socket from 'socket.io';

export default function IO(server: any) {
    const io = socket(server);

    io.on('connection', socket => {
        //
    });

    return io;
}
