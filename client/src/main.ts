import { Router } from './lib/turtle/router.js';

import { JoinView } from './views/join.js';
import { RoomView } from './views/room.js';

window.addEventListener('load', async () => {
    console.log(`saved page: '${Cookies.get('view')}'`);
    let joinView = new JoinView();
    let roomView = new RoomView();
    Router
        .add(joinView.ID, joinView.load)
        .add(/room\/(.+)/, roomView.load)
        .navigate(Cookies.get('view'));
});
