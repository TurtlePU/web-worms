/** Shortcut for getElementById. */
export const $ = document.getElementById.bind(document);

/** Base class of Views ('pages') of Single-Page Apps. */
export class View {
    /** ID of a View. Good practice is to use it as a route for Router. */
    readonly ID: string;

    private readonly HTML: string;

    /**
     * @constructor
     * Constructs View from given ID and HTML.
     * Good practice is to predefine them in inherited Views.
     * @param ID
     * @param HTML
     */
    constructor(ID: string, HTML: string) {
        console.log(`'${ID}'.constructor()`);

        this.ID = ID;
        this.HTML = HTML;

        this.load = this.load.bind(this);
    }

    /**
     * Sets this View on screen.
     * Good practice is to use it as a handler for Router.
     * @param path - path from which this View is loaded
     * @param _args - any load properties defined in subclasses
     */
    load(path: string, ..._args: any) {
        console.log(`'${this.ID}'.load('${path}')`);
        document.body.innerHTML = this.HTML;
    }
};
