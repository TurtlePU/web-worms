import { PartialState, SocketState, dummy } from './socket-state';

export class StatePool {
    private pool: Map<string, SocketState>

    constructor() {
        this.pool = new Map();
    }

    init(id: string) {
        this.pool.set(id, dummy);
    }

    get(id: string) {
        return this.pool.get(id) || dummy;
    }

    set(id: string, state: PartialState) {
        let old_state = this.pool.get(id);
        this.pool.set(id, { ...old_state, ...state });
    }

    inherit(old_id: string, new_id: string) {
        let state = this.pool.get(old_id);
        if (!state) {
            return false;
        }
        this.pool.set(new_id, state);
        this.pool.delete(old_id);
        return true;
    }
}

export default new StatePool();
