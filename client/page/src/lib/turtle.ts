import * as cookies from './js.cookie.js';
export const Cookies = cookies;

import * as htmlUtil from './html.util.js';
export const HtmlUtil = htmlUtil;
export const $ = HtmlUtil.$;

export class View<PropsType> {
    id: string;
    html: string;
    props: PropsType;

    constructor(id: string, html: string) {
        this.id = id;
        this.html = html;
        this.load = this.load.bind(this);
    }

    load(props?: PropsType) {
        HtmlUtil.setView(this.html);
        Cookies.set('view', this.id);
        this.props = props;
    }
};
