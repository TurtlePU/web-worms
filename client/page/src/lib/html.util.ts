export const $ = document.getElementById.bind(document);

export function setView(innerHTML: string) {
    document.body.innerHTML = innerHTML;
};
