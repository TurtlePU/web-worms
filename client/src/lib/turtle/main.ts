///<reference path='js.cookie.d.ts'/>

export const $ = document.getElementById.bind(document);

function setView(innerHTML: string) {
    document.body.innerHTML = innerHTML;
};

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
        setView(this.html);
        Cookies.set('view', this.id);
        this.props = props;
    }
};
