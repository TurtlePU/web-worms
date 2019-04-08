import { $, View } from '../lib/turtle/main.js';
import { Router } from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Worms II</h1>
    <input type='text' id='room-id' placeholder='Room ID'>
    <button id='go'>Go</button> <button id='random'>I'm lucky</button>
`;

export class JoinView extends View<null> {
    input: HTMLInputElement;

    constructor() {
        super('', html);
        this.joinRoom.bind(this);
    }

    async joinRoom(rnd?: boolean) {
        let url = document.URL.split('#')[0];
        if (rnd) {
            let room = await fetch(url + 'getRoom');
            Router.navigate(`rooms/${room}`);
        } else {
            let room = this.input.value;
            let exists = await fetch(url + `checkRoom?id=${room}`);
            if (exists) {
                Router.navigate(`rooms/${room}`);
            }
        }
    }

    load() {
        super.load();

        this.input = <HTMLInputElement> $('room-id');
        this.input.addEventListener('keypress', async event => {
            if (event.key === 'Enter') {
                await this.joinRoom();
            }
        });

        let goButton = <HTMLButtonElement> $('go');
        goButton.addEventListener('click', async () => await this.joinRoom());

        let rdButton = <HTMLButtonElement> $('random');
        rdButton.addEventListener('click', async () => await this.joinRoom(true));
    }
}
