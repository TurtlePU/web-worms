import { Router } from './lib/turtle/router.js';

import { RootView } from './views/root.js';
import { IndexView } from './views/index.js';

window.addEventListener('load', async () => {
    console.log(Cookies.get('view'));
    Router
        .add(new RootView())
        .add(new IndexView())
        .navigate(Cookies.get('view'));
});
