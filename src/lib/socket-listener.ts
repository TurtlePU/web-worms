export default class Listener {
    event: string;
    handler: (...args: any[]) => void;
    constructor(event: string, handler: (...args: any[]) => void) {
        this.event = event;
        this.handler = handler;
    }
}
