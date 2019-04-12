import socket from 'socket.io';

import Lobby from './lobby';
import Room  from './room';

import Requester from './requester';

/**
 * Adds event listeners to the given socket.
 * @param socket - Socket passed on 'connection' event
 */
export default function(socket: socket.Socket) {
    console.log('new socket connected');

    new Requester('join')
        .on('getLobby', Lobby.ID)
        .on('checkLobby', Lobby.has)
        .on('checkRoom', (roomID: string, socketID: string) => {
            return Room.has(roomID) &&
                   Room.get(roomID).had(socketID);
        })
        .apply(socket);

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
}
