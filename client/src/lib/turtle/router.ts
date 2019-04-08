export type RouterMode = 'hash' | 'history';

export type RouterOptions = {
    mode?: RouterMode,
    root?: string
};

export type RouterEntry = {
    matcher: string | RegExp,
    handler: Function
};

import { View } from './main.js';

function clearSlashes(path: string) {
    return path.replace(/\/$/, '').replace(/^\//, '');
};

export const Router = {
    _routes: [] as RouterEntry[],
    _mode: 'hash' as RouterMode,
    _root: '/',

    config: (options?: RouterOptions) => {
        console.log('Router.config with')
        console.log(options);
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

        console.log(`configged with: { ${Router._mode}, '${Router._root}' }`);
        return Router;
    },

    _getFragment: () => {
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

    add: (arg: RouterEntry | View<any>) => {
        console.log('adding path to:');
        console.log(arg);
        Router._routes.push(
            arg instanceof View
                ? { matcher: arg.id,
                    handler: arg.load }
                : arg
        );
        return Router;
    },

    remove: (param: string | RegExp | Function) => {
        console.log('removing path on:');
        console.log(param);
        Router._routes.some((element, index, array) => {
            if ((element.matcher && element.matcher === param) || element.handler === param) {
                array.splice(index, 1);
                return true;
            }
        });
        return Router;
    },

    flush: () => {
        Router._routes = [];
        Router._mode = 'hash';
        Router._root = '/';
        return Router;
    },

    _check: () => {
        let fragment = Router._getFragment();
        Router._routes.some(element => {
            let match = fragment.match(element.matcher);
            if (match !== null && (match[0] !== '' || fragment === '')) {
                console.log(`found matching route: ${fragment} ~ ${match[0]}`);
                match.shift();
                element.handler(match);
                return true;
            }
        });
        return Router;
    },

    navigate: (path?: string) => {
        path = path ? path : '';
        console.log(`navigating to: '${path}'`);
        if (Router._mode === 'history') {
            history.pushState(null, null, Router._root + clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }
        return Router._check();
    }
};
