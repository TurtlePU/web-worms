import Router from 'router';
import socket from 'socket';

import { readFileSync } from 'fs';
import { $, View } from 'turtle';

import * as Cookies from 'cookie';

export default class JoinView extends View {
    private input: HTMLInputElement;

    constructor() {
        super('join', readFileSync(__dirname + '/view.html', 'utf8'));
        this.joinConcrete = this.joinConcrete.bind(this);
    }

    async load(path: string) {
        super.load(path);

        this.input = <HTMLInputElement> $('lobby-id');
        this.input.onkeypress = async event => {
            if (event.key === 'Enter') {
                await this.joinConcrete();
            }
        };

        $('go').onclick = () => this.joinConcrete();

        $('random').onclick = async () => {
            let id = await socket.request('lobby:get');
            Router.navigate(`lobby/${id}`);
        };

        let old_socket_id = Cookies.get('socket');
        Cookies.set('socket', socket.id);
        if (!await socket.request('state:inherit', old_socket_id)) {
            console.warn('old socket state not found');
        }
        let room_id = (await socket.request('state:get')).room_id;

        $('reconnect').onclick = () => {
            Router.navigate(`room/${room_id}`);
        };
    }

    private async joinConcrete() {
        let lobby = this.input.value.replace(/\s/g, '');
        if (lobby !== '') {
            let exists = await socket.request('lobby:check', lobby);
            if (exists) {
                Router.navigate(`lobby/${lobby}`);
            } else {
                Router.navigate(`room/${lobby}`);
            }
        }
    }
}
