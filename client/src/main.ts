import { Router } from './lib/router.js';
import { $, setView } from './lib/html.util.js';

export function RootHandler() {
    let rootHtml = (<HTMLScriptElement> $('root')).innerHTML;
    setView(rootHtml);
    let button = <HTMLButtonElement> $('root-to-index');
    button.addEventListener('click', () => Router.navigate('index'));
    console.log('KOK --- main');
}

import { IndexHandler } from './views/index.js';

window.addEventListener('load', async () => {
    Router.add({
        matcher: '',
        handler: RootHandler
    }).add({
        matcher: 'index',
        handler: IndexHandler
    }).navigate();
});
