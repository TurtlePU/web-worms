import { Handler } from './handler';

/** Socket info in context of some lobby. Made to extend. */
export interface SocketInfo {
    /** All its handlers. */
    handlers: Handler[]
}
