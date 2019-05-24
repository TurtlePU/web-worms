import io from 'socket.io-client';

var socket = <Socket> io();

socket.request = async (request: string, ...args: any[]) => {
    return new Promise((resolve, reject) => {
        console.log(`socket.request <= ${request}`);
        let timeout = window.setTimeout(() => {
            reject(`${request}: Connection timed out`);
        }, 10 * 1000);
        socket.emit(request, ...args, (...args: any[]) => {
            window.clearTimeout(timeout);
            console.log(`socket.request =>`, ...args);
            resolve(...args);
        });
    });
};

export default socket;

interface Socket extends SocketIOClient.Socket {
    /**
     * Sends socket request.
     * @param request - request name
     * @param args - any params of request
     * @returns Promise resolving with the request result
     */
    request(request: string, ...args: any[]): Promise<any>
}
