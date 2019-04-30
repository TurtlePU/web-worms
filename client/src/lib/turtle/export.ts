/** Shortcut for getElementById. */
export const $ = (id: string) => document.getElementById(id);

/** Base class of Views ('pages') of Single-Page Apps. */
export class View {
    /** ID of a View. Good practice is to use it as a route for Router. */
    readonly id: string;
    /** HTML to be set when View is loaded. */
    private readonly html: string;

    /**
     * @constructor
     * Constructs View from given id and html.
     * Good practice is to predefine them in inherited Views.
     * @param id
     * @param html
     */
    constructor(id: string, html: string) {
        console.log(`'${id}'.constructor()`);

        this.id = id;
        this.html = html;

        this.load = this.load.bind(this);
    }

    /**
     * Sets this View on screen.
     * Good practice is to use it as a handler for Router.
     * @param path - path from which this View is loaded
     * @param _args - any load properties defined in subclasses
     */
    load(path: string, ..._args: any) {
        console.log(`'${this.id}'.load('${path}')`);
        document.body.innerHTML = this.html;
    }
};
