///<reference path='../lib/js.cookie.d.ts'/>

import { View } from '../lib/turtle/main.js';
import Router from '../lib/turtle/router.js';

import { socket } from '../lib/socket/wrapper.js';

import GameRules from '../game/game-rules.js';
import Graphics  from '../game/graphics.js';
import Physics   from '../game/physics.js';

const html = /* html */`
`;

function fail(message: string) {
    Router.navigate('join');
    alert(message);
}

export default class RoomView extends View {
    private gameRules: GameRules;
    private graphics: Graphics;
    private physics: Physics;

    constructor() {
        super('room', html);

        socket
        .on('room:start', (roomID: string) => {
            Router.navigate(`room/${roomID}`);
        })
    }

    async load(path: string, roomID: string) {
        super.load(path);

        if (!await socket.request('room:check', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is inaccessible from old socket`);
        }
        if (!await socket.request('room:join', roomID, Cookies.get('socket'))) {
            return fail(`Room ${roomID} is full`);
        }

        // TODO: init UI

        this.gameRules = new GameRules(await socket.request('room:scheme:game'));
        this.graphics  = new Graphics();
        this.physics   = new Physics(await socket.request('room:scheme:physics'));
    }
}
