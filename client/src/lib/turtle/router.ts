// Single-page hash router.
// Made by Turtle, P.U. in 2019
// Based on http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

type RouterEntry = {
    matcher: RegExp,
    handler: Function
}

function clearSlashes(path: string) {
    return path.replace(/\/$/, '').replace(/^\//, '');
}

function toRegExp(pattern: string | RegExp) {
    return new RegExp(
        typeof pattern === 'string'
            ? `^${pattern}$`
            : pattern
    );
}

function getFragment() {
    let match = window.location.href.match(/#(.*)$/);
    let fragment = match ? match[1] : '';
    return clearSlashes(fragment);
}

class Router {
    private routes = [] as RouterEntry[];
    private _root = '';
    private listening = false;
    private current = '';

    constructor() {
        this.listener = this.listener.bind(this);
    }

    private listener() {
        let fragment = getFragment();
        if (this.current != fragment) {
            console.log(`HashChange <= '${fragment}'`);
            this.current = fragment;
            this.check();
        }
    }

    /**
     * Sets redirection for failed checks (aka start page).
     * @param root - redirection path
     * @returns Router
     */
    root(root: string) {
        this._root = root;
        return this;
    }

    /**
     * Adds new route to be controlled by Router.
     * @param matcher - route or RegEx for a series of routes
     * @param handler - function called when route is navigated. Must accept (path, ...captures of matcher)
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
     * Removes a given route.
     * @param matcher - route or RegEx for a series of routes
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
     * Stops listening bar change.
     * @returns Router
     */
    unlisten() {
        console.log('Router.unlisten');
        window.removeEventListener('hashchange', this.listener);
        this.listening = false;
        return Router;
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
            this.navigate(this._root);
        }
        return Router;
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
}
const router = new Router();
export default router;
