///<reference path="lib/pixi.js.d.ts"/>

document.addEventListener('DOMContentLoaded', main);

async function main() {
    const app = new PIXI.Application();
    document.body.appendChild(app.view);
}
