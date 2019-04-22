import socket from 'socket.io';

import Lobby from './lib/lobby';
import Room  from './lib/room';

import RequestChannel from './lib/socket-util/request-channel';
import BroadcastChannel from './lib/socket-util/broadcast-channel';

const lobbyRequests = new RequestChannel('lobby')
    .on('get', Lobby.ID)
    .on('check', Lobby.has);

const roomRequests = new RequestChannel('room')
    .on('check', (roomID: string, socketID: string) => {
        return Room.has(roomID) && Room.get(roomID).had(socketID);
    })

/**
 * Adds event listeners to the given socket.
 * @param socket - Socket passed on 'connection' event
 */
export default function(socket: socket.Socket) {
    console.log('new socket connected');

    lobbyRequests.plug(socket);
    roomRequests.plug(socket);

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
}
