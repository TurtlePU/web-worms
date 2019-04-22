///<reference path='js.cookie.d.ts'/>

/** Shortcut for {@link document.getElementById}. */
export const $ = document.getElementById.bind(document);

function setView(innerHTML: string) {
    document.body.innerHTML = innerHTML;
};

/** Base class of Views ('pages') of Single-Page Apps. */
export class View {
    /** ID of a View. Good practice is to use it as a route for {@link router.ts#Router}. */
    readonly ID: string;
    /** HTML string to show when view is loaded. */
    private readonly HTML: string;

    /**
     * @constructor
     * Constructs View from given ID and HTML. Good practice is to predefine them in inherited Views.
     * 
     * @param ID
     * @param HTML
     */
    constructor(ID: string, HTML: string) {
        this.ID = ID;
        this.HTML = HTML;
        this.load = this.load.bind(this);
        console.log(`View.constructor <= { ID: ${ID}, HTML: ... }`);
    }

    /**
     * Sets this View on screen. Good practice is to use it as a handler for {@link router.ts#Router}.
     * 
     * @param path - path from which this View is loaded
     * @param _args - any load properties defined in subclasses
     */
    load(path: string, ..._args: any) {
        console.log(`View.load <= '${path}'`);
        console.log(`HTML view <= '${this.ID}'`);
        setView(this.HTML);
        Cookies.set('view', path);
    }
};
