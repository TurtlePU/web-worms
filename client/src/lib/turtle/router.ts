/** Available modes of Router. */
export type RouterMode = 'hash' | 'history';

/** Input type for {@link router.ts#Router.config}. */
export type RouterOptions = {
    mode?: RouterMode,
    root?: string
};

type RouterEntry = {
    matcher: RegExp,
    handler: Function
};

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

/** Interface of a Router. */
export interface Router {
    /**
     * Updates mode and root of Router.
     * 
     * @param options - options to be applied
     * @returns Router
     */
    config(options: RouterOptions): Router,

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
     * @param route
     * @returns Router
     */
    remove(route: string | RegExp): Router,

    /**
     * Removes all routes.
     * 
     * @returns Router
     */
    flush(): Router,

    /**
     * Navigates to a route, if it is handled by Router. Otherwise does nothing.
     * 
     * @param route
     * @returns Router
     */
    navigate(route: string): Router
}

var _routes: RouterEntry[] = [];
var _mode: RouterMode = 'hash';
var _root = '/';

const _check = (path: string) => {
    return _routes.some(element => {
        let match = path.match(element.matcher);
        if (match !== null) {
            console.log(`Route._check => '${path}' ~ '${match[0]}'`);
            match.shift();
            element.handler(path, ...match);
            return true;
        }
    });
};

/**
 * Singleton Router object for Single-Page Apps.
 */
export const Router = {
    config: (options?: RouterOptions) => {
        console.log('Router.config <=', options);
        if (options) {
            _mode = options.mode && !!(history.pushState) ? 'history' : 'hash';
            _root = options.root ? '/' + clearSlashes(options.root) + '/' : '/';
        }
        console.log(`Router.config => { mode: ${_mode}, root: '${_root}' }`);
        return Router;
    },

    add: (matcher: string | RegExp, handler: Function) => {
        console.log(`Router.add <= '${matcher}'`);
        matcher = toRegExp(matcher);
        _routes.push({
            handler,
            matcher
        });
        return Router;
    },

    remove: (route: string | RegExp) => {
        console.log('Router.remove <=', route);
        route = toRegExp(route);
        _routes.some((element, index, array) => {
            if (element.matcher === route) {
                array.splice(index, 1);
                return true;
            }
        });
        return Router;
    },

    flush: () => {
        console.log('Router.flush');
        _routes = [];
        _mode = 'hash';
        _root = '/';
        return Router;
    },

    navigate: (route?: string) => {
        route = route ? route : '';
        console.log(`Router.navigate <= '${route}'`);
        if (_check(route)) {
            if (_mode === 'history') {
                history.pushState(null, null, _root + clearSlashes(route));
            } else {
                window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + route;
            }
        } else {
            console.log('Router.navigate => null');
        }
        return Router;
    }
} as Router;
