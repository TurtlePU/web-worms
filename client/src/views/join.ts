import { $, View } from '../lib/turtle/export.js';
import Router from '../lib/turtle/router.js';

import { socket } from '../lib/socket/wrapper.js';

// TODO: reconnect button

const html = /* html */`
    <h1>Worms II</h1>
    <input type='text' id='lobby-id' placeholder='Lobby/Room ID'>
    <button id='go'>Go</button> <button id='random'>I'm lucky</button>
`;

export default class JoinView extends View {
    private input: HTMLInputElement;

    constructor() {
        super('join', html);

        this.joinRandom = this.joinRandom.bind(this);
        this.joinConcrete = this.joinConcrete.bind(this);
    }

    private async joinRandom() {
        let id = await socket.request('lobby:get');
        Router.navigate(`lobby/${id}`);
    }

    private async joinConcrete() {
        let lobby = this.input.value.replace(/\s/g, '');
        if (lobby !== '') {
            let exists = await socket.request('lobby:check', lobby);
            if (exists) {
                Router.navigate(`lobby/${lobby}`);
            } else {
                Router.navigate(`room/${lobby}`);
            }
        }
    }

    load(path: string) {
        super.load(path);

        this.input = <HTMLInputElement> $('lobby-id');
        this.input.onkeypress = async event => {
            if (event.key === 'Enter') {
                await this.joinConcrete();
            }
        };

        $(  'go'  ).onclick = this.joinConcrete;
        $('random').onclick = this.joinRandom;
    }
}
