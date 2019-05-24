import RoomPool from './socket/room-pool';
import StatePool from './socket/state-pool';

import { digits } from './data/export';
import { initIdGenerator } from './lib/id-generator';
import { State, Room } from './socket/room-class';
import { SocketState } from './socket/socket-state';
import { Socket } from './socket/socket-class';

initIdGenerator(digits, 3);

/**
 * Adds event listeners to the given socket.
 * @param socket - Socket passed on 'connection' event
 */
export default function(io: SocketIO.Server) {
    Room.io = io;
    return function(socket: SocketIO.Socket) {
        console.log('+ socket');

        StatePool.init(socket.id);
        let wrap = new Socket(socket);

        on_default_events(socket);
        on_state_events(socket);
        on_lobby_events(socket, wrap);
        on_room_events(socket, wrap);    
    };
}

function on_default_events(socket: SocketIO.Socket) {
    socket
        .on('disconnect', () => {
            console.log('- socket');
        });
}

function on_state_events(socket: SocketIO.Socket) {
    socket
        .on('state:inherit', (old_socket_id: string, ack: (_: boolean) => void) => {
            ack(StatePool.inherit(
                old_socket_id, socket.id
            ));
        })
        .on('state:get', (ack: (_: SocketState) => void) => {
            ack(StatePool.get(socket.id));
        });
}

function on_lobby_events(socket: SocketIO.Socket, wrap: Socket) {
    socket
        .on('lobby:get', (ack: (_: string) => void) => {
            ack(RoomPool.get_lobby_id());
        })
        .on('lobby:check', (lobby_id: string, ack: (_: boolean) => void) => {
            let lobby = RoomPool.get(lobby_id);
            ack(
                lobby.state == State.LOBBY &&
                !lobby.full()
            );
        })
        .on('lobby:join', (lobby_id: string, ack: (_: boolean) => void) => {
            let lobby = RoomPool.get(lobby_id);
            ack(
                lobby.state == State.LOBBY &&
                lobby.join(wrap)
            );
        })
        .on('lobby:members', (room_id: string, ack: (_: any[]) => void) => {
            ack(RoomPool.get(room_id).members);
        });
}

function on_room_events(socket: SocketIO.Socket, wrap: Socket) {
    socket
        .on('room:check', (room_id: string, ack: (_: boolean) => void) => {
            ack(
                RoomPool.get(room_id).state == State.ROOM &&
                StatePool.get(socket.id).room_id == room_id
            );
        })
        .on('room:join', (room_id: string, ack: (_: boolean) => void) => {
            let room = RoomPool.get(room_id);
            ack(
                room.state == State.ROOM &&
                StatePool.get(socket.id).room_id == room_id &&
                room.join(wrap)
            );
        });
}
