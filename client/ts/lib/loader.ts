///<reference path="pixi.js.d.ts"/>

export default class Loader extends PIXI.loaders.Loader {
    async loadAsync() {
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.load(resolve);
        });
    }
}
