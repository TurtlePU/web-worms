///<reference path="lib/pixi.js.d.ts"/>

import Loader from './lib/loader.js';

document.addEventListener('DOMContentLoaded', main);

async function main() {
    const app = new PIXI.Application();
    document.body.appendChild(app.view);

    const loader = new Loader();
    const result = await loader.loadAsync();
}
