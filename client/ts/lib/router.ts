export type RouterMode = 'hash' | 'history';

export type RouterOptions = {
    mode?: RouterMode,
    root?: string
};

export type RouterEntry = {
    matcher: string | RegExp,
    handler: Function
};

function clearSlashes(path: string) {
    return path.replace(/\/$/, '').replace(/^\//, '');
};

export const Router = {
    _routes: [] as RouterEntry[],
    _mode: 'hash' as RouterMode,
    _root: '/',
    listens: false,

    config: function(options?: RouterOptions) {
        Router._mode =
                options &&
                options.mode &&
                options.mode === 'history' &&
                !!(history.pushState)
            ? 'history'
            : 'hash';

        Router._root =
                options &&
                options.root
            ? '/' + clearSlashes(options.root) + '/'
            : '/';

        return Router;
    },

    _getFragment: function() {
        let fragment = '';
        if (Router._mode === 'history') {
            fragment = clearSlashes(
                    decodeURI(location.pathname + location.search)
                ).replace(/\?(.*)$/, '');
            fragment = Router._root != '/'
                ? fragment.replace(Router._root, '')
                : fragment;
        } else {
            let match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }
        return clearSlashes(fragment);
    },

    add: function(options: RouterEntry) {
        Router._routes.push(options);
        return Router;
    },

    remove: function(param: string | RegExp | Function) {
        Router._routes.some((element, index, array) => {
            if ((element.matcher && element.matcher === param) || element.handler === param) {
                array.splice(index, 1);
                return true;
            }
        });
        return Router;
    },

    flush: function() {
        Router._routes = [];
        Router._mode = 'hash';
        Router._root = '/';
        return Router;
    },

    _check: function() {
        let fragment = Router._getFragment();
        Router._routes.some(element => {
            let match = fragment.match(element.matcher);
            if (match !== null) {
                match.shift();
                element.handler(match);
                return true;
            }
        });
        return Router;
    },

    listen: function() {
        if (!Router.listens) {
            window.addEventListener('hashchange', Router._check);
            Router.listens = true;
        }
        return Router;
    },

    navigate: function(path: string | null) {
        path = path ? path : '';
        if (Router._mode === 'history') {
            history.pushState(null, null, Router._root + clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }
        return this;
    }
};
