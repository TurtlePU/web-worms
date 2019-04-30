// Single-page hash router.
// Made by Turtle, P.U. in 2019.
// Based on http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

/** Format in which redirection units are passed. */
type InputEntry = {
    /** 'key' of unit. */
    matcher: string | RegExp,
    /** Actions performed by unit. */
    handler: Function
};

/** Redirection unit. */
type RouterEntry = InputEntry & {
    matcher: RegExp
};

/** Class of Router for single-page apps. */
class Router {
    /** Default route. */
    private root = '';
    /** Current route. */
    private current = '';
    /** True if router listens for hash change. */
    private listening = false;
    /** List of redirection units. */
    private routes = [] as RouterEntry[];

    /** Makes new router. Note: is not configged. */
    constructor() {
        this.listener = this.listener.bind(this);
    }

    /** Listener for hash change. */
    private listener() {
        let fragment = getFragment();
        if (this.current != fragment) {
            console.log(`HashChange <= '${fragment}'`);
            this.current = fragment;
            this.check();
        }
    }

    /**
     * Adds new route to be controlled by Router.
     * @param matcher - route or RegEx for a series of routes.
     * @param handler - function called when route is navigated. Must accept (path, ...captures of matcher).
     * @returns Router
     */
    add(matcher: string | RegExp, handler: Function) {
        console.log(`Router.add <= '${matcher}'`);
        matcher = toRegExp(matcher);
        this.routes.push({
            matcher,
            handler
        });
        return this;
    }

    /**
     * Searches for the given route (or one in the address bar) and sets its view if found.
     * Otherwise navigates to the main page.
     * @param route
     * @returns Router
     */
    check(route?: string) {
        route = route || getFragment();
        console.log(`Router.check <= '${route}'`);
        let res = this.routes.some(element => {
            let match = route.match(element.matcher);
            if (match !== null) {
                console.log(`Router.check => '${route}' === '${match[0]}'`);
                match.shift();
                element.handler(route, ...match);
                return true;
            }
        });
        if (!res) {
            console.log(`Router.check => none`);
            this.navigate(this.root);
        }
        return Router;
    }

    /**
     * Removes all routes.
     * @returns Router
     */
    flush() {
        console.log('Router.flush');
        this.routes = [];
        return this.unlisten();
    }

    /**
     * Sets listener of address bar. Essential to work.
     * @returns Router
     */
    listen() {
        console.log('Router.listen');
        if (!this.listening) {
            this.listening = true;
            console.log('Router.listen => HashChange');
            window.addEventListener('hashchange', this.listener);
        } else {
            console.log('Router.listen => already listening');
        }
        return this;
    }

    /**
     * Changes the address bar. If not given, makes force check().
     * If given, check() is called automatically if Router listens.
     * @param route
     * @returns Router
     */
    navigate(route?: string) {
        if (route) {
            console.log(`Router.navigate <= '${route}'`);
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + route;
        } else {
            this.check();
        }
        return this;
    }

    /**
     * Removes a given route.
     * @param matcher - route or RegEx for a series of routes.
     * @returns Router
     */
    remove(matcher: string | RegExp) {
        console.log(`Router.remove <= '${matcher}'`);
        matcher = toRegExp(matcher);
        this.routes.some((element, index, array) => {
            if (element.matcher === matcher) {
                array.splice(index, 1);
                return true;
            }
        });
        return this;
    }

    /**
     * Sets redirection for failed checks (aka start page).
     * @param root - redirection path.
     * @returns Router
     */
    setRoot(root: string) {
        this.root = root;
        return this;
    }

    /**
     * Stops listening bar change.
     * @returns Router
     */
    unlisten() {
        console.log('Router.unlisten');
        window.removeEventListener('hashchange', this.listener);
        this.listening = false;
        return Router;
    }
}

function clearSlashes(path: string) {
    return path.replace(/\/$/, '').replace(/^\//, '');
}

function getFragment() {
    let match = window.location.href.match(/#(.*)$/);
    let fragment = match ? match[1] : '';
    return clearSlashes(fragment);
}

function toRegExp(pattern: string | RegExp) {
    return new RegExp(
        typeof pattern === 'string'
            ? `^${pattern}$`
            : pattern
    );
}

export default new Router();
