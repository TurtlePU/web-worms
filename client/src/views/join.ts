import { $ } from '../lib/turtle/main.js';
import { SocketView } from '../lib/turtle/socket.view.js';
import { Router } from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Worms II</h1>
    <input type='text' id='lobby-id' placeholder='Lobby/Room ID'>
    <button id='go'>Go</button> <button id='random'>I'm lucky</button>
`;

function skipSpaces(str: string) {
    return str.replace(/\s/g, '');
}

export default class JoinView extends SocketView {
    private input: HTMLInputElement;

    constructor() {
        super('join', html);
        this.joinLobby.bind(this);
    }

    private async joinLobby(rnd?: boolean) {
        if (rnd) {
            let id = await this.socketRequest('join:getLobby');
            Router.navigate(`lobby/${id}`);
        } else {
            let lobby = skipSpaces(this.input.value);
            if (lobby !== '') {
                let exists = await this.socketRequest('join:checkLobby', lobby);
                if (exists) {
                    Router.navigate(`lobby/${lobby}`);
                } else {
                    let oldSocket = Cookies.get('socket');
                    let joinable = await this.socketRequest('join:checkRoom', lobby, oldSocket);
                    if (joinable) {
                        Router.navigate(`room/${lobby}`);
                    } else {
                        alert(`Lobby or room '${lobby}' not found or inaccessible, try again`);
                    }
                }
            }
        }
    }

    load(path: string, socket: SocketIOClient.Socket) {
        super.load(path, socket);

        this.input = <HTMLInputElement> $('lobby-id');
        this.input.onkeypress = async event => {
            if (event.key === 'Enter') {
                await this.joinLobby();
            }
        };

        let goButton = <HTMLButtonElement> $('go');
        goButton.onclick = async () => await this.joinLobby();

        let rdButton = <HTMLButtonElement> $('random');
        rdButton.onclick = async () => await this.joinLobby(true);
    }
}
