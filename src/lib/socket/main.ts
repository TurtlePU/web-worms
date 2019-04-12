import socket from 'socket.io';

import { LobbyPool } from './lobby/pool';
import { RoomPool } from './room/pool';
import Requester from './requester';

function handleSocket(socket: socket.Socket) {
    console.log('new socket connected');

    new Requester('join')
        .on('getLobby', LobbyPool.getLobbyID)
        .on('checkLobby', LobbyPool.checkLobby)
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
