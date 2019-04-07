import { $, View } from '../lib/turtle.js';
import { Router } from '../lib/router.js';

import { index } from '../../js-lib/view.import.js';

export class IndexView extends View<null> {
    constructor() { super('index', index); }
    load() {
        super.load();
        let button = <HTMLButtonElement> $('route');
        button.addEventListener('click', () => Router.navigate(''));
    }
}
