import socket from 'socket.io';

import Lobby from './lib/lobby';
import Room  from './lib/room';

Lobby.on('start', (id: string, sockets: socket.Socket[]) => {
    Room.from(id, sockets);
    Room.get(id).start();
});

Room.on('end', (id: string) => {
    Lobby.flush(id);
});

/**
 * Adds event listeners to the given socket.
 * @param socket - Socket passed on 'connection' event
 */
export default function(socket: socket.Socket) {
    console.log('+ socket');

    socket
    .on('lobby:get', (ack: (_: string) => void) => {
        ack(Lobby.firstVacant().id);
    })
    .on('lobby:check', (lobbyID: string, ack: (_: boolean) => void) => {
        ack(!Lobby.get(lobbyID).full());
    })
    .on('lobby:join', (lobbyID: string, ack: (_: boolean) => void) => {
        ack(Lobby.get(lobbyID).add(socket));
    })
    .on('lobby:members', (lobbyID: string, ack: (_: any[]) => void) => {
        ack(Lobby.get(lobbyID).members());
    });

    socket
    .on('room:check', (roomID: string, socketID: string, ack: (_: boolean) => void) => {
        ack(Room.get(roomID).had(socketID));
    })
    .on('room:join', (roomID: string, socketID: string, ack: (_: boolean) => void) => {
        ack(
            Room.get(roomID).had(socketID) &&
            Room.get(roomID).add(socket)
        );
    });

    socket.on('disconnect', () => {
        console.log('- socket');
    });
}
