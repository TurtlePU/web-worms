import socket from 'socket.io';

import { RoomHandler } from './rooms';
import Room from '../game/room';

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
        let room: Room;

        socket.once('res:getRoom', roomID => {
            room = RoomHandler.getRoom(roomID);
            room.capture(socket);
        });
        socket.emit('req:getRoom');

        socket.on('disconnect', () => {
            room.release(socket);
            console.log('socket disconnected');
        });
    });

    return io;
}
