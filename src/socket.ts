import socket from 'socket.io';

import Lobby, { LobbyWatcher } from './lib/lobby';
import Room from './lib/room';

LobbyWatcher.on('lobby:start', (ID: string, sockets: socket.Socket[]) => {
    Room.from(ID, sockets);
    Room.get(ID).start();
});

/**
 * Adds event listeners to the given socket.
 * @param socket - Socket passed on 'connection' event
 */
export default function(socket: socket.Socket) {
    console.log('+ socket');

    socket
    .on('lobby:get', ack => {
        ack(Lobby.ID());
    })
    .on('lobby:check', (lobbyID, ack) => {
        ack(!Lobby.get(lobbyID).full());
    })
    .on('lobby:join', (lobbyID, ack) => {
        ack(Lobby.get(lobbyID).push(socket));
    })
    .on('lobby:members', (lobbyID, ack) => {
        ack(Lobby.get(lobbyID).members());
    });

    socket
    .on('room:check', (roomID, socketID, ack) => {
        ack(Room.get(roomID).had(socketID));
    })
    .on('room:join', (roomID, socketID, ack) => {
        ack(
            Room.get(roomID).had(socketID) &&
            Room.get(roomID).push(socket)
        );
    });

    socket.on('disconnect', () => {
        console.log('- socket');
    });
}
