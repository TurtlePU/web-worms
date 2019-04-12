import socket from 'socket.io';

import Lobby from './lobby';
import Room  from './room';

import RequestChannel from './request-channel';

const joinChannel = new RequestChannel('join')
    .on('getLobby', Lobby.ID)
    .on('checkLobby', Lobby.has)
    .on('checkRoom', (roomID: string, socketID: string) => {
        return Room.has(roomID) &&
            Room.get(roomID).had(socketID);
    });

/**
 * Adds event listeners to the given socket.
 * @param socket - Socket passed on 'connection' event
 */
export default function(socket: socket.Socket) {
    console.log('new socket connected');

    joinChannel.apply(socket);

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
}
