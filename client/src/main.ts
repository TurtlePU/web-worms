import { Router } from './lib/turtle/router.js';

import { JoinView } from './views/join.js';
import { RoomView } from './views/room.js';

window.addEventListener('load', async () => {
    console.log(`Saved page: '${Cookies.get('view')}'`);
    let joinView = new JoinView();
    let roomView = new RoomView();
    Router
        .add(joinView.ID, joinView.load)
        .add(/room\/(.+)/, roomView.load)
        .listen()
        .navigate(Cookies.get('view') || joinView.ID, true);
});
