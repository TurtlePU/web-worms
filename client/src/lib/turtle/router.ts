type RouterEntry = {
    matcher: RegExp,
    handler: Function
};

/** Interface of a Router. */
export interface Router {
    /**
     * Adds new route to be controlled by Router.
     * 
     * @param matcher - route or RegEx for a series of routes
     * @param handler - function called when route is navigated. Must accept (path, ...captures of matcher)
     * @returns Router
     */
    add(matcher: string | RegExp, handler: Function): Router,

    /**
     * Removes a given route.
     * 
     * @param matcher - route or RegEx for a series of routes
     * @returns Router
     */
    remove(matcher: string | RegExp): Router,

    /**
     * Removes all routes.
     * 
     * @returns Router
     */
    flush(): Router,

    /**
     * Sets listener of address bar. Essential to work.
     * 
     * @returns Router
     */
    listen(): Router,
    
    /**
     * Stops listening bar change.
     * 
     * @returns Router
     */
    unlisten(): Router,

    /**
     * Searches for the given route and sets its view if found. Otherwise navigates to the last saved view.
     * 
     * @param route
     * @returns Router
     */
    check(route?: string): Router,

    /**
     * Changes the address bar. Router.check() is called automatically if Router listens.
     * 
     * @param route
     * @returns Router
     */
    navigate(route: string, forceCheck?: boolean): Router
}

const helper = {
    routes: [] as RouterEntry[],
    root: '/',

    clearSlashes(path: string) {
        return path.replace(/\/$/, '').replace(/^\//, '');
    },

    toRegExp(pattern: string | RegExp) {
        return new RegExp(
            typeof pattern === 'string'
                ? `^${pattern}$`
                : pattern
        );
    },

    getFragment() {
        let match = window.location.href.match(/#(.*)$/);
        let fragment = match ? match[1] : '';
        return helper.clearSlashes(fragment);
    },

    listening: false,
    current: '',
    listener() {
        let fragment = helper.getFragment();
        if (helper.current !== fragment) {
            console.log(`HashChange <= '${fragment}'`);
            helper.current = fragment;
            Router.check();
        }
    }
};

/**
 * Singleton Router object for Single-Page Apps.
 */
export const Router = {
    add(matcher: string | RegExp, handler: Function) {
        console.log(`Router.add <= '${matcher}'`);
        matcher = helper.toRegExp(matcher);
        helper.routes.push({
            matcher,
            handler
        });
        return Router;
    },

    remove(matcher: string | RegExp) {
        console.log(`Router.remove <= '${matcher}'`);
        matcher = helper.toRegExp(matcher);
        helper.routes.some((element, index, array) => {
            if (element.matcher === matcher) {
                array.splice(index, 1);
                return true;
            }
        });
        return Router;
    },

    flush() {
        console.log('Router.flush');
        helper.routes = [];
        return Router.unlisten();
    },

    check(route?: string) {
        route = route || helper.getFragment();
        console.log(`Router.check <= '${route}'`);
        let res = helper.routes.some(element => {
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
            Router.navigate(Cookies.get('view'));
        }
        return Router;
    },

    listen() {
        console.log('Router.listen');
        if (!helper.listening) {
            helper.listening = true;
            console.log('Router.listen => HashChange');
            window.addEventListener('hashchange', helper.listener);
        } else {
            console.log('Router.listen => already listening');
        }
        return Router;
    },

    unlisten() {
        console.log('Router.unlisten');
        window.removeEventListener('hashchange', helper.listener);
        helper.listening = false;
        return Router;
    },

    navigate(route: string, forceCheck?: boolean) {
        console.log(`Router.navigate <= '${route}'`);
        window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + route;
        if (forceCheck) {
            Router.check();
        }
        return Router;
    }
} as Router;
