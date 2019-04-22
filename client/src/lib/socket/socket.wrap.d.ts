declare namespace SocketIOClient { 
    interface Socket {
        /**
         * Sends socket request.
         * @param request - request name
         * @param args - any params of request
         * @returns Promise resolving with the request result
         */
        request(request: string, ...args: any[]): Promise<any>
    }
}
