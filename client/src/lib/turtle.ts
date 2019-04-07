import * as Cookie from './js.cookie.js';
import { $, setView } from './html.util.js';

export * from './html.util.js';
export * from './router.js';
export const Cookies = Cookie;

export class ViewHandler<PropsType> {
    id: string;
    props: PropsType;

    constructor(id: string) {
        this.id = id;
    }

    load(props: PropsType) {
        let html = (<HTMLScriptElement> $(this.id)).innerHTML;
        setView(html);
        Cookies.set('view', this.id);
        this.props = props;
    }
};
