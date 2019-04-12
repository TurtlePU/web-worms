import socket, { Socket } from 'socket.io';
import { LobbyHandler } from './lobby/handler';
import { RoomHandler } from './room/handler';
import Requester from './requester';

function handleSocket(socket: Socket) {
    console.log('new socket connected');

    new Requester('join')
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
