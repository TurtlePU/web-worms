/** Wrapper for .on args. */
export class Handler {
    /** Name of an event. */
    event: string;
    /** Callback binded to given event. */
    callback: (...args: any[]) => void;
    /**
     * Makes new wrapper for .on args.
     * @param event - string name of an event.
     * @param callback - function called on given event.
     */
    constructor(event: string, callback: (...args: any[]) => void) {
        this.event = event;
        this.callback = callback;
    }
}
