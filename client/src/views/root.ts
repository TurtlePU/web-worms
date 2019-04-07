import { $, View } from '../lib/turtle/main.js';
import { Router } from '../lib/turtle/router.js';

const root = /* html */ `
    <p>Root</p>
    <button id='route'>To index</button>
`;

export class RootView extends View<null> {
    constructor() { super('', root); }
    load() {
        super.load();
        let button = <HTMLButtonElement> $('route');
        button.addEventListener('click', () => Router.navigate('index'));
    }
}
