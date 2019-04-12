import socket, { Socket } from 'socket.io';
import { LobbyHandler } from './lobby/lobbies';
import { RoomHandler } from './room/handler';
import { Requester } from './requester';

class SocketHandler {
    constructor(socket: Socket) {
        console.log('new socket connected');

        Requester
            .channel('join')
            .on('getLobby', LobbyHandler.getLobbyID)
            .on('checkLobby', LobbyHandler.checkLobby)
            .on('checkRoom', (roomID: string, socketID: string) => {
                return RoomHandler.getRoom(roomID) &&
                       RoomHandler.getRoom(roomID).has(socketID);
            })
            .apply(socket);

        socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
    }
}

/**
 * Wrapper on Socket server for game needs.
 * 
 * @param server Server to retrieve events from
 * @returns Socket server with binded game events
 */
export default function IO(server: any) {
    const io = socket(server);
    io.on('connection', socket => new SocketHandler(socket));
    return io;
}
