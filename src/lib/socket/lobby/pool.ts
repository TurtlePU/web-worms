import Lobby from './class';

/** Interface of LobbyPool. */
export interface ILobbyPool {
    /**
     * @returns ID of non-full lobby
     */
    getLobbyID(): string,

    /**
     * @param lobbyID ID of a lobby
     * @returns true if one can join the room, false otherwise
     */
    checkLobby(lobbyID: string): boolean
}

const helper = {
    lobby: new Map<string, Lobby>(),
    full: new Map<string, Lobby>()
};

/** Singleton lobby manager. */
export const LobbyPool = {
    getLobbyID() {
        if (helper.lobby.size === 0) {
            let lb = new Lobby();
            helper.lobby.set(lb.ID, lb);
        }
        return helper.lobby.keys().next().value;
    },

    checkLobby(lobbyID: string) {
        return helper.lobby.has(lobbyID);
    }
} as ILobbyPool;
