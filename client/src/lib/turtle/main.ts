///<reference path='js.cookie.d.ts'/>

/** Shortcut for {@link document.getElementById}. */
export const $ = document.getElementById.bind(document);

function setView(innerHTML: string) {
    document.body.innerHTML = innerHTML;
};

/** Base class of Views ('pages') of Single-Page Apps. */
export class View<PropsType> {
    /** ID of a View. Good practice is to use it as a route for {@link router.ts#Router}. */
    ID: string;
    /** HTML string to show when view is loaded. */
    private HTML: string;
    /** Any props given on load. Good practice is to accept them from {@link router.ts#Router.navigate}. */
    protected props: PropsType;

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
    }

    /**
     * Sets this View on screen. Good practice is to use it as a handler for {@link router.ts#Router}.
     * 
     * @param props 
     */
    load(props?: PropsType) {
        setView(this.HTML);
        Cookies.set('view', this.ID);
        this.props = props;
    }
};
