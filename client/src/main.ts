import { Router } from './lib/turtle/router.js';

import { JoinView } from './views/join.js';

window.addEventListener('load', async () => {
    console.log(`saved page: '${Cookies.get('view')}'`);
    let joinView = new JoinView();
    Router
        .add(joinView.ID, joinView.load)
        .navigate(Cookies.get('view'));
});
