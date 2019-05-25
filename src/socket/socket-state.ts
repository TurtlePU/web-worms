export type SocketState = {
    ready: boolean,
    room_id: string
}

type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type PartialState = Partial<SocketState>;

export const dummy: SocketState = {
    ready: false,
    room_id: 'ERROR: no room'
};
