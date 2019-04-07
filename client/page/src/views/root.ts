import { $, View } from '../lib/turtle.js';
import { Router } from '../lib/router.js';

import { root } from '../../js-lib/view.import.js';

export class RootView extends View<null> {
    constructor() { super('', root); }
    load() {
        super.load();
        let button = <HTMLButtonElement> $('route');
        button.addEventListener('click', () => Router.navigate('index'));
    }
}
