import { Socket } from 'socket.io';

import { next_id } from './id-generator';

import {
    Handler,
    ISocketRoom,
    Pool,
    SocketInfo,
    SocketRoom
} from './room/export';

class LobbyPool extends Pool<ILobby> {
    /** IDs of lobbies which have vacant places. */
    private vacants: Set<String>;

    /** @override in LobbyPool. */
    constructor() {
        super({
            id: 'lobby dummy',
            add: (_: any) => false,
            flush: () => {},
            full: () => true,
            members: () => []
        });
        this.vacants = new Set();
    }

    /** @override in LobbyPool. */
    protected add(lobby: Lobby) {
        this.vacants.add(lobby.id);
        lobby
        .on('full', () => {
            this.vacants.delete(lobby.id);
        })
        .on('start', () => {
            this.vacants.delete(lobby.id);
            this.emit('start',
                lobby.id,
                lobby.get_socket_list()
            );
        })
        .on('vacant', () => {
            this.vacants.add(lobby.id);
        });
        return super.add(lobby);
    }

    /** First lobby which has vacant places. */
    firstVacant() {
        if (this.vacants.size == 0) {
            this.add(new Lobby());
        }
        return this.pool.get(
            this.vacants.values().next().value
        );
    }

    /**
     * Makes Lobby on given id empty
     * @param id
     */
    flush(id: string) {
        this.get(id).flush();
        this.vacants.add(id);
    }
}

export default new LobbyPool();

interface ILobby extends ISocketRoom {
    /** @returns true if lobby is full. */
    full(): boolean,
    /** @returns list of connected sockets' IDs. */
    members(): ClientInfo[]
}

class Lobby extends SocketRoom<Info> implements ILobby {
    /** Max number of players in one lobby. */
    private static readonly CAPACITY = 4;

    /** Makes new lobby with human-readable random id. */
    constructor() {
        super(next_id());
    }

    add(socket: Socket) {
        if (this.full()) {
            return false;
        } else {
            super.add(socket);
            this.emitJoin(socket);
            this.emitEnabled();
            if (this.full()) {
                this.emit('full');
            }
            return true;
        }
    }

    private emitEnabled() {
        if (this.sockets.length == 0) {
            return;
        }
        this.sockets[0].emit(
            'lobby:start-enabled',
            this.ready()
        );
    }

    private emitJoin(socket: Socket) {
        this.cast('lobby:join',
            socket.id,
            false,
            socket.id == this.sockets[0].id
        );
    }

    private emitLeft(socket: Socket) {
        this.cast('lobby:left', socket.id);
    }

    private emitReady(socket: Socket) {
        this.cast('lobby:ready',
            socket.id,
            this.socketInfo.get(socket.id).ready,
            socket.id == this.sockets[0].id
        );
    }

    full() {
        return this.sockets.length == Lobby.CAPACITY;
    }

    protected handlers(socket: Socket) {
        const leave = () => {
            this.remove(socket);
            this.emitLeft(socket);
            this.emitEnabled();
        };
        return [
            new Handler('lobby:left', leave),
            new Handler('disconnect', leave),
            new Handler('lobby:ready', (ready) => {
                this.socketInfo.get(socket.id).ready = ready;
                this.emitReady(socket);
                this.emitEnabled();
            }),
            new Handler('lobby:start', (ack) => {
                if (!this.ready()) {
                    return ack(false);
                }
                ack(true);
                this.disconnectAll();
                this.emit('start');
            })
        ];
    }

    members() {
        return this.sockets.map((socket, index) => {
            return {
                id: socket.id,
                ready: this.socketInfo.get(socket.id).ready,
                first: index == 0
            };
        });
    }

    private ready() {
        return [...this.socketInfo.values()]
            .every(info => info.ready);
    }

    /** @override in Lobby. */
    remove(socket: Socket) {
        if(super.remove(socket)) {
            this.emit('vacant');
            return true;
        }
        return false;
    }

    protected SocketInfo(handlers: Handler[]) {
        return {
            ready: false,
            handlers
        };
    }
}

interface Info extends SocketInfo {
    ready: boolean
}

interface ClientInfo {
    id: string,
    ready: boolean,
    first: boolean
}
