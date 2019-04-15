declare namespace SocketIOClient { 
    interface Socket {
        /**
         * Configs socket to the given channel.
         * @param name - name of a channel
         * @returns this
         */
        channel(name: string): this,

        /**
         * Sends socket request via preconfigged channel.
         * @param request - request name
         * @param args - any params of request
         * @returns Promise resolving with the request result
         */
        request(request: string, ...args: any[]): Promise<any>
    }
}
