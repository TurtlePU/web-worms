import { $, View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

import { socket } from '../lib/socket/wrapper.js';

const html = /* html */`
    <h1>Worms II</h1>
    <input type='text' id='lobby-id' placeholder='Lobby/Room ID'>
    <button id='go'>Go</button> <button id='random'>I'm lucky</button>
`;

export default class JoinView extends View {
    private input: HTMLInputElement;

    constructor() {
        super('join', html);
        this.joinLobby.bind(this);
    }

    private async joinLobby(rnd?: boolean) {
        if (rnd) {
            let id = await socket.channel('lobby').request('get');
            Router.navigate(`lobby/${id}`);
        } else {
            let lobby = this.input.value.replace(/\s/g, '');
            if (lobby !== '') {
                let exists = await socket.channel('lobby').request('check', lobby);
                if (exists) {
                    Router.navigate(`lobby/${lobby}`);
                } else {
                    Router.navigate(`room/${lobby}`);
                }
            }
        }
    }

    load(path: string) {
        super.load(path);

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
