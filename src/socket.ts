import socket from 'socket.io';

import Lobby from './lib/lobby';
import Room  from './lib/room';

import RequestChannel from './lib/socket-util/request-channel';
import BroadcastChannel from './lib/socket-util/broadcast-channel';

const joinRequests = new RequestChannel('lobby')
    .on('get', Lobby.ID)
    .on('check', Lobby.has);

/**
 * Adds event listeners to the given socket.
 * @param socket - Socket passed on 'connection' event
 */
export default function(socket: socket.Socket) {
    console.log('new socket connected');

    joinRequests.plug(socket);

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
}
