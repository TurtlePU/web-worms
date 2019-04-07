import { $, View } from '../lib/turtle/main.js';
import { Router } from '../lib/turtle/router.js';

const index = /* html */ `
    <p>Index</p>
    <button id='route'>To root</button>
`;

export class IndexView extends View<null> {
    constructor() { super('index', index); }
    load() {
        super.load();
        let button = <HTMLButtonElement> $('route');
        button.addEventListener('click', () => Router.navigate(''));
    }
}
