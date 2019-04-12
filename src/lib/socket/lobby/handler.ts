import Lobby from './class';

/** Interface of LobbyHandler. */
export interface LobbyHandler {
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
export const LobbyHandler = {
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
} as LobbyHandler;
