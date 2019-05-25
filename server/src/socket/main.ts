import RoomPool from './room-pool';
import StatePool from './state-pool';

import { digits } from '../data/export';
import { initIdGenerator, beautify } from '../lib/id-generator';
import { State, Room } from './room-class';
import { SocketState } from './socket-state';
import { Socket } from './socket-class';

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

        on_default_events(socket, wrap);
        on_state_events(socket);
        on_lobby_events(socket, wrap);
        on_room_events(socket, wrap);
        on_game_events(socket, wrap);    
    };
}

/**
 * Adds listeners of default events to the given socket.
 * @param socket socket itself
 * @param wrap our own wrapper above it
 */
function on_default_events(socket: SocketIO.Socket, wrap: Socket) {
    socket
        .on('disconnect', () => {
            console.log('- socket');
            RoomPool.get(wrap.room_id).leave(wrap);
        });
}

/**
 * Adds listeners of 'state:*' events to the given socket.
 * @param socket socket itself
 */
function on_state_events(socket: SocketIO.Socket) {
    socket
        .on('state:inherit', (old_socket_id: string, ack: (_: boolean) => void) => {
            ack(StatePool.inherit(old_socket_id, socket.id));
        })
        .on('state:get', (ack: (_: SocketState) => void) => {
            ack(StatePool.get(socket.id));
        });
}

/**
 * Adds listeners of 'lobby:*' events to the given socket.
 * @param socket socket itself
 * @param wrap our wrapper above it
 */
function on_lobby_events(socket: SocketIO.Socket, wrap: Socket) {
    socket
        .on('lobby:get', (ack: (_: string) => void) => {
            ack(RoomPool.get_lobby_id());
        })
        .on('lobby:getme', (ack: (_: string) => void) => {
            ack(beautify(socket.id));
        })
        .on('lobby:check', (lobby_id: string, ack: (_: boolean) => void) => {
            let lobby = RoomPool.get(lobby_id);
            ack(lobby.state == State.LOBBY && !lobby.is_full());
        })
        .on('lobby:join', (lobby_id: string, ack: (_: boolean) => void) => {
            let lobby = RoomPool.get(lobby_id);
            ack(lobby.state == State.LOBBY && lobby.join(wrap));
        })
        .on('lobby:members', (lobby_id: string, ack: (_: any[]) => void) => {
            ack(RoomPool.get(lobby_id).members);
        })
        .on('lobby:ready', (ready: boolean) => {
            wrap.ready = ready;
            let lobby = RoomPool.get(wrap.room_id);
            lobby.state == State.LOBBY && lobby.cast_ready(wrap);
        })
        .on('lobby:start', (ack: (_: boolean) => void) => {
            let lobby = RoomPool.get(wrap.room_id);
            ack(lobby.is_ready() && lobby.load_game());
        })
        .on('lobby:left', () => {
            let lobby = RoomPool.get(wrap.room_id);
            lobby.state == State.LOBBY && lobby.leave(wrap);
        });
}

/**
 * Adds listeners of 'room:*' events to the given socket.
 * @param socket socket itself
 * @param wrap our wrapper above it
 */
function on_room_events(socket: SocketIO.Socket, wrap: Socket) {
    socket
        .on('room:reconnect', (ack: (_: boolean) => void) => {
            let room = RoomPool.get(wrap.room_id);
            ack(room.state == State.ROOM && room.join(wrap));
        })
        .on('room:checkme', (room_id: string, ack: (_: boolean) => void) => {
            ack(
                room_id == wrap.room_id &&
                RoomPool.get(room_id).state == State.LOADING
            );
        })
        .on('room:left', () => {
            let room = RoomPool.get(wrap.room_id);
            room.state == State.ROOM && room.leave(wrap);
        });
}

/**
 * Adds listeners of 'game:*' events to the given socket.
 * @param socket socket itself
 * @param wrap our wrapper above it
 */
function on_game_events(socket: SocketIO.Socket, wrap: Socket) {
    socket
        .on('game:ready', (ack: (_: boolean) => void) => {
            wrap.ready = true;
            ack(RoomPool.get(wrap.room_id).start_game());
        })
        .on('game:scheme', (ack: (rules: any, physics: any) => void) => {
            let schemes = RoomPool.get(wrap.room_id).schemes;
            ack(schemes.rules, schemes.physics);
        });
}
