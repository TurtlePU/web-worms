import socket from 'socket.io';

import Lobby from './lobby';
import { RoomPool } from './room/pool';
import Requester from './requester';

function handleSocket(socket: socket.Socket) {
    console.log('new socket connected');

    new Requester('join')
        .on('getLobby', Lobby.ID)
        .on('checkLobby', Lobby.has)
        .on('checkRoom', (roomID: string, socketID: string) => {
            return RoomPool.getRoom(roomID) &&
                   RoomPool.getRoom(roomID).has(socketID);
        })
        .apply(socket);

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
}

/**
 * Wrapper on Socket server for game needs.
 * 
 * @param server Server to retrieve events from
 * @returns Socket server with binded game events
 */
export default function IO(server: any) {
    const io = socket(server);
    io.on('connection', handleSocket);
    return io;
}
