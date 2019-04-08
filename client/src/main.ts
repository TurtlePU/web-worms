import { Router } from './lib/turtle/router.js';

import { JoinView } from './views/join.js';

window.addEventListener('load', async () => {
    console.log(`saved page: '${Cookies.get('view')}'`);
    Router
        .add(new JoinView())
        .navigate(Cookies.get('view'));
});
