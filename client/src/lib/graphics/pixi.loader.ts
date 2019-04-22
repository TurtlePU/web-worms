///<reference path='pixi.js.d.ts'/>

/** Small Loader wrapper to load with Promises. */
export default class Loader extends PIXI.loaders.Loader {
    /**
     * Loads given assets, promisified.
     * @returns loading Promise
     */
    async loadAsync(): Promise<this> {
        console.log('PIXI.Loader.loadAsync');
        return new Promise((resolve, reject) => {
            this.once('error', reject);
            this.load(resolve);
        });
    }
}
